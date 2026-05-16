import "server-only";
import { redirect } from "next/navigation";
import type { JwtUserToken } from "@/tipes/auth";
import { currentSession } from "./session";

/**
 * Ensures a user is authenticated and returns the user data.
 * Redirects to /login if session or user data is missing.
 * Used in Page components or Server Actions to guard access.
 */
export async function requireUser(): Promise<JwtUserToken> {
	const session = await currentSession();

	if (!session.user || !session.refreshToken) {
		redirect("/login");
	}

	return session.user;
}
