"use server";

import { rawFetch, safeAction } from "@/lib/api";
import { signIn } from "@/lib/session";
import { appConfig } from "@/lib/utils";
import type { LoginSchema, LoginToken } from "@/tipes/auth";

export const doLogin = async (formData: LoginSchema) => {
	return safeAction(async () => {
		const data = new FormData();
		data.append("username", formData.username);
		data.append("password", formData.password);
		data.append("client_id", `${appConfig.client_id}`);
		data.append("client_secret", `${appConfig.client_secret}`);
		data.append("grant_type", "password");

		const result = await rawFetch<LoginToken>("/token", {
			method: "POST",
			body: data,
		});

		await signIn(result);
		return result;
	});
};
