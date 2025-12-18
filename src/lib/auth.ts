"use server";

import { redirect } from "next/navigation";
import { destroySession, getSession } from "./session";
import { appConfig } from "./utils";

export const renewToken = async () => {
	const session = await getSession();
	const req = await fetch(`${appConfig.apiUrl}/refresh`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ token: session.refresh_token }),
	});

	if (!req.ok) redirect("/login");

	const result = await req.json();
	return result.data;
};

export const logout = async () => {
	await destroySession();
	redirect("/login");
};
