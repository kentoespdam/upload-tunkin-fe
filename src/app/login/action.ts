"use server";

import { ApiError, rawFetch } from "@/lib/api";
import { signIn } from "@/lib/session";
import { appConfig } from "@/lib/utils";
import type { LoginSchema, LoginToken } from "@/tipes/auth";
import type { BaseResponse } from "@/tipes/commons";

export const doLogin = async (
	formData: LoginSchema,
): Promise<BaseResponse<LoginToken>> => {
	const data = new FormData();
	data.append("username", formData.username);
	data.append("password", formData.password);
	data.append("client_id", `${appConfig.client_id}`);
	data.append("client_secret", `${appConfig.client_secret}`);
	data.append("grant_type", "password");

	try {
		const result = await rawFetch<LoginToken>("/token", {
			method: "POST",
			body: data,
		});

		await signIn(result);

		return {
			status: 200,
			data: result,
			message: "Login successful",
			timestamp: new Date().toISOString(),
			request_id: "local",
		};
	} catch (error) {
		if (error instanceof ApiError) {
			return error.body as BaseResponse<LoginToken>;
		}
		return {
			status: 500,
			data: {} as LoginToken,
			message: "Network error",
			errors: ["Network error"],
			timestamp: new Date().toISOString(),
			request_id: "local",
		};
	}
};
