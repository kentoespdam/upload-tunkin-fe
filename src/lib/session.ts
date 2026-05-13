import "server-only";
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
 * Decodes JWT payload without verification.
 * Safe to use on server for HttpOnly cookies.
 */
const decodeJwt = (token: string): JwtUserToken | null => {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const payload = parts[1];
		// Using Buffer for Node.js compatibility (proxy.ts runs in nodejs)
		const decoded = Buffer.from(payload, "base64").toString("utf-8");
		return JSON.parse(decoded);
	} catch {
		return null;
	}
};

/**
 * Returns the current session state from cookies.
 * Synchronous and network-free.
 */
export const currentSession = async (): Promise<Session> => {
	const cookieStore = await cookies();
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

	const user = decodeJwt(accessToken);
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
 * Writes tokens to HttpOnly cookies.
 */
export const signIn = async (token: LoginToken) => {
	const cookieStore = await cookies();

	const user = decodeJwt(token.access_token);
	const expiresAt = user ? new Date(user.exp * 1000) : undefined;

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
		// If refresh token is also a JWT, we could use its exp.
		// For now, follow the requirement to use JWT exp (assumed from access_token or common sense).
		// Typically refresh tokens have much longer life, but we'll use access token exp
		// if that's what's intended or if refresh token isn't a JWT.
		const refreshUser = decodeJwt(token.refresh_token);
		const refreshExpiresAt = refreshUser
			? new Date(refreshUser.exp * 1000)
			: undefined;

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
