import "server-only";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import type { LoginToken } from "@/tipes/auth";
import type { BaseResponse } from "@/tipes/commons";
import { currentSession, signOut, writeTokens } from "./session";
import { appConfig } from "./utils";

export class ApiError extends Error {
	constructor(
		public status: number,
		public body: unknown,
		message?: string,
	) {
		super(message || `API Error: ${status}`);
		this.name = "ApiError";
	}
}

export type ActionResult<T> =
	| { ok: true; data: T }
	| { ok: false; status: number; message: string; errors?: string[] };

/**
 * Wraps a server action function to handle errors and redirects safely.
 * Rethrows NEXT_REDIRECT errors so Next.js can handle them.
 */
export async function safeAction<T>(
	fn: () => Promise<T>,
): Promise<ActionResult<T>> {
	try {
		const data = await fn();
		return { ok: true, data };
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		if (error instanceof ApiError) {
			const body = error.body as BaseResponse<unknown>;
			let errors: string[] | undefined;
			if (body?.errors) {
				errors = Array.isArray(body.errors) ? body.errors : [body.errors];
			}
			return {
				ok: false,
				status: error.status,
				message: error.message,
				errors,
			};
		}

		console.error("Action failed:", error);
		return {
			ok: false,
			status: 500,
			message: error instanceof Error ? error.message : "Internal Server Error",
		};
	}
}

/**
 * Ensures a valid access token is available.
 * If expired, attempts to refresh. Redirects to login if anything fails.
 */
export async function ensureFreshToken(): Promise<string> {
	const session = await currentSession();

	// No way to refresh without refresh_token
	if (!session.refreshToken) {
		await signOut();
		redirect("/login");
	}

	// Token is still valid
	if (!session.isExpired && session.accessToken) {
		return session.accessToken;
	}

	// Attempt refresh
	try {
		const result = await rawFetch<LoginToken>("/refresh", {
			method: "POST",
			body: JSON.stringify({ token: session.refreshToken }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		await writeTokens(result);
		return result.access_token;
	} catch (error) {
		console.error("Token refresh failed:", error);
		await signOut();
		redirect("/login");
	}
}

/**
 * rawFetch handles basic HTTP I/O without automatic authorization.
 * Used for pre-login endpoints like /token or /refresh.
 */
export async function rawFetch<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const baseUrl = appConfig.apiUrl?.replace(/\/$/, "") || "";
	const fullPath = path.startsWith("/") ? path : `/${path}`;
	const url = `${baseUrl}${fullPath}`;

	const res = await fetch(url, init);

	let result: unknown;
	try {
		result = await res.json();
	} catch (_e) {
		throw new ApiError(res.status, null, "Failed to parse JSON response");
	}

	if (!res.ok) {
		const errorBody = result as { message?: string };
		throw new ApiError(
			res.status,
			result,
			errorBody?.message || res.statusText,
		);
	}

	// Assuming backend always wraps in BaseResponse<T>
	return (result as BaseResponse<T>).data;
}

/**
 * apiFetch handles authorized HTTP I/O.
 * Automatically adds Bearer token and handles body serialization.
 */
export async function apiFetch<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const token = await ensureFreshToken();

	const headers = new Headers(init?.headers);
	headers.set("Authorization", `Bearer ${token}`);

	let body = init?.body;
	// Automatic JSON serialization for plain objects
	if (
		body &&
		!(body instanceof FormData) &&
		!(body instanceof ReadableStream) &&
		!(body instanceof Blob) &&
		!(body instanceof ArrayBuffer) &&
		typeof body === "object"
	) {
		body = JSON.stringify(body);
		if (!headers.has("Content-Type")) {
			headers.set("Content-Type", "application/json");
		}
	}

	return rawFetch<T>(path, {
		...init,
		headers,
		body,
	});
}
