import "server-only";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import type { JwtUserToken, LoginToken } from "@/tipes/auth";

export type Session = {
	accessToken: string;
	refreshToken: string;
	user: JwtUserToken | null;
	expiresAt: number;
	isExpired: boolean;
};

/**
 * Extracts the expiration time from a JWT.
 */
export const getTokenExp = (token: string): number => {
	try {
		const decoded = decodeJwt<JwtUserToken>(token);
		return (decoded?.exp || 0) * 1000;
	} catch {
		return 0;
	}
};

/**
 * Returns the current session state from a given cookie store.
 */
export const getSessionFromCookies = (cookieStore: {
	get: (name: string) => { value: string } | undefined;
}): Session => {
	const accessToken = cookieStore.get("access_token")?.value ?? "";
	const refreshToken = cookieStore.get("refresh_token")?.value ?? "";

	if (!accessToken) {
		return {
			accessToken: "",
			refreshToken,
			user: null,
			expiresAt: 0,
			isExpired: true,
		};
	}

	let user: JwtUserToken | null = null;
	try {
		user = decodeJwt<JwtUserToken>(accessToken);
	} catch (_e) {
		// Ignore decode errors
	}

	const expiresAt = user ? user.exp * 1000 : 0;
	const isExpired = Date.now() >= expiresAt - 5000; // 5s buffer

	return {
		accessToken,
		refreshToken,
		user,
		expiresAt,
		isExpired,
	};
};

/**
 * Returns the current session state from cookies.
 * Synchronous and network-free.
 */
export const currentSession = async (): Promise<Session> => {
	const cookieStore = await cookies();
	return getSessionFromCookies(cookieStore);
};

/**
 * Writes tokens to HttpOnly cookies.
 */
export const signIn = async (token: LoginToken) => {
	const cookieStore = await cookies();

	const expiresAt = token.access_token
		? new Date(getTokenExp(token.access_token))
		: undefined;

	const commonOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		path: "/",
	};

	cookieStore.set("access_token", token.access_token, {
		...commonOptions,
		expires: expiresAt,
	});

	if (token.refresh_token) {
		const refreshExpiresAt = new Date(getTokenExp(token.refresh_token));

		cookieStore.set("refresh_token", token.refresh_token, {
			...commonOptions,
			expires: refreshExpiresAt || expiresAt,
		});
	}
};

/**
 * Removes session cookies.
 */
export const signOut = async () => {
	const cookieStore = await cookies();
	cookieStore.delete("access_token");
	cookieStore.delete("refresh_token");
};

/**
 * Alias for signIn, used during token refresh.
 */
export const writeTokens = signIn;
