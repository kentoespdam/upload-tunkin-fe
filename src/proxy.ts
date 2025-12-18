import { type NextRequest, NextResponse } from "next/server";
import { createSession, getSession } from "./lib/session";
import { appConfig } from "./lib/utils";

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|logo_pdam_40x40|/login|test).*)",
	],
};

const publicRoutes = ["/login"];

export default async function proxy(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isPublicRoute = publicRoutes.includes(path);
	const session = await getSession();
	const isAuthenticated = session.refresh_token !== "";
	const isAuthorized = session.access_token !== "";

	if (!isAuthenticated) {
		if (!isPublicRoute) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
		return NextResponse.next();
	}

	if (!isAuthorized) {
		const newToken = await renewAccess(session.refresh_token);
		if (newToken) {
			await createSession(newToken);
			return NextResponse.redirect(req.url);
		}
		if (!isPublicRoute)
			return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}

async function renewAccess(refresh_token: string) {
	const formData = { token: refresh_token };
	const req = await fetch(`${appConfig.apiUrl}/refresh`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	});

	const result = await req.json();
	if (!req.ok) {
		return null;
	}

	return result.data;
}
