import { type NextRequest, NextResponse } from "next/server";
import { rawFetch } from "./lib/api";
import {
	getSessionFromCookies,
	getTokenExp,
	type Session,
} from "./lib/session";
import { appConfig } from "./lib/utils";
import type { BaseToken } from "./tipes/auth";

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|logo_pdam_40x40|sitemap.xml|robots.txt).*)",
	],
};

const PROTECTED_PREFIXES = ["/dashboard"];
const REFRESH_BUFFER_MS = 10_000;

/**
 * Resolves session from request cookies.
 */
function resolveSession(req: NextRequest): Session {
	return getSessionFromCookies(req.cookies);
}

/**
 * Sets session cookies on the response.
 */
function setCookieOnResponse(
	res: NextResponse,
	accessToken: string,
	refreshToken: string,
) {
	const accessExp = getTokenExp(accessToken);
	const refreshExp = getTokenExp(refreshToken);

	const commonOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		path: "/",
	};

	if (accessToken) {
		res.cookies.set("access_token", accessToken, {
			...commonOptions,
			expires: accessExp ? new Date(accessExp) : undefined,
		});
	}

	if (refreshToken) {
		res.cookies.set("refresh_token", refreshToken, {
			...commonOptions,
			expires: refreshExp ? new Date(refreshExp) : undefined,
		});
	}
}

export async function proxy(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const session = resolveSession(req);

	// 1. API Proxy
	if (path.startsWith("/api/proxy/")) {
		const apiUrl = appConfig.apiUrl?.replace(/\/$/, "") || "";
		const targetPath = path.replace("/api/proxy", ""); // includes leading slash if path was /api/proxy/something
		const targetUrl = new URL(apiUrl + targetPath + req.nextUrl.search);

		const headers = new Headers(req.headers);
		headers.delete("host"); // Let fetch set the correct host

		// Handle refresh for API proxy if needed
		const now = Date.now();
		const needsRefresh =
			session.refreshToken &&
			(session.isExpired || now >= session.expiresAt - REFRESH_BUFFER_MS);

		if (needsRefresh) {
			try {
				const result = await rawFetch<BaseToken>("/refresh", {
					method: "POST",
					body: JSON.stringify({ token: session.refreshToken }),
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (result?.access_token) {
					session.accessToken = result.access_token;
				}
			} catch (error) {
				console.error("API Proxy token refresh failed:", error);
			}
		}

		if (session.accessToken) {
			headers.set("Authorization", `Bearer ${session.accessToken}`);
		}

		const res = NextResponse.rewrite(targetUrl, {
			request: {
				headers: headers,
			},
		});

		if (session.accessToken) {
			setCookieOnResponse(res, session.accessToken, session.refreshToken);
		}
		return res;
	}

	// 2. Logged-in redirect from /login
	if (path === "/login" && session.refreshToken && !session.isExpired) {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}

	// 3. Protected Route Gatekeeper
	const isProtected = PROTECTED_PREFIXES.some((prefix) =>
		path.startsWith(prefix),
	);

	if (isProtected) {
		if (!session.refreshToken) {
			return NextResponse.redirect(new URL("/login", req.url));
		}

		// Check if token needs refresh (with buffer)
		const now = Date.now();
		const needsRefresh =
			session.isExpired || now >= session.expiresAt - REFRESH_BUFFER_MS;

		if (needsRefresh) {
			try {
				const result = await rawFetch<BaseToken>("/refresh", {
					method: "POST",
					body: JSON.stringify({ token: session.refreshToken }),
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (result?.access_token) {
					const requestHeaders = new Headers(req.headers);
					requestHeaders.set("Authorization", `Bearer ${result.access_token}`);

					const res = NextResponse.next({
						request: {
							headers: requestHeaders,
						},
					});
					setCookieOnResponse(res, result.access_token, session.refreshToken);
					return res;
				}
			} catch (error) {
				console.error("Middleware token refresh failed:", error);
				const res = NextResponse.redirect(new URL("/login", req.url));
				res.cookies.delete("access_token");
				res.cookies.delete("refresh_token");
				return res;
			}
		}

		// Sliding cookie for valid session
		const requestHeaders = new Headers(req.headers);
		if (session.accessToken) {
			requestHeaders.set("Authorization", `Bearer ${session.accessToken}`);
		}

		const res = NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
		setCookieOnResponse(res, session.accessToken, session.refreshToken);
		return res;
	}

	return NextResponse.next();
}
