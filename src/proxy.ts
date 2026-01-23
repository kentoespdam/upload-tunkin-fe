import { type NextRequest, NextResponse } from "next/server";
import { createSession, destroySession, getSession } from "./lib/session";
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

	// Jika tidak ada refresh token, redirect ke login
	if (!isAuthenticated) {
		if (!isPublicRoute) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
		return NextResponse.next();
	}

	// Jika access token tidak ada, coba refresh
	if (!isAuthorized) {
		const newToken = await renewAccess(session.refresh_token);
		if (newToken) {
			// Berhasil refresh, buat response dan set cookies langsung
			const response = NextResponse.next();
			await createSession(newToken);
			return response;
		}

		// Gagal refresh - hapus session untuk menghindari loop
		await destroySession();
		if (!isPublicRoute) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
	}

	return NextResponse.next();
}

async function renewAccess(refresh_token: string) {
	try {
		const formData = { token: refresh_token };
		const req = await fetch(`${appConfig.apiUrl}/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
			// Tambahkan timeout untuk menghindari hanging
			signal: AbortSignal.timeout(10000), // 10 detik timeout
		});

		if (!req.ok) {
			console.error(`Refresh token failed with status: ${req.status}`);
			return null;
		}

		const result = await req.json();
		return result.data;
	} catch (error) {
		// Tangani network error, timeout, dll
		console.error("Error during token refresh:", error);
		return null;
	}
}
