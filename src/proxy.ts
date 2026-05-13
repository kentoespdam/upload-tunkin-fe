import { type NextRequest, NextResponse } from "next/server";
import { currentSession } from "./lib/session";

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|logo_pdam_40x40|/login|test).*)",
	],
};

const publicRoutes = ["/login"];

export async function proxy(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isPublicRoute = publicRoutes.includes(path);
	const session = await currentSession();

	// Optimistic gatekeeper: only check for session existence.
	// No network calls here. Refresh is handled by DAL/apiFetch.
	if (!session.refreshToken && !isPublicRoute) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}
