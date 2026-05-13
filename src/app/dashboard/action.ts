"use server";

import { ApiError, apiFetch } from "@/lib/api";
import type { BaseResponse, PageResponse } from "@/tipes/commons";
import type { Tunkin } from "@/tipes/tunkin";

export const fetchTunkin = async (
	params: string,
): Promise<PageResponse<Tunkin>> => {
	const search = new URLSearchParams(params);
	const periode = search.get("periode") || "";
	search.delete("periode");

	const path = `/tunkin/${periode}?${search.toString()}`;
	return apiFetch<PageResponse<Tunkin>>(path);
};

export const cekExistingTunkin = async (
	periode: string,
): Promise<{ is_exist: boolean }> => {
	return apiFetch<{ is_exist: boolean }>(`/tunkin/exists/${periode}`);
};

export const doUpload = async (
	formData: FormData,
): Promise<BaseResponse<unknown>> => {
	try {
		const result = await apiFetch<unknown>("/tunkin/upload", {
			method: "POST",
			body: formData,
		});

		return {
			data: result,
			status: 200,
			message: "Upload successful",
			timestamp: new Date().toISOString(),
			request_id: "local",
		};
	} catch (error) {
		if (error instanceof ApiError) {
			return error.body as BaseResponse<unknown>;
		}
		return {
			status: 500,
			data: null,
			errors: ["Network error during upload"],
			message: "Network error",
			timestamp: new Date().toISOString(),
			request_id: "local",
		};
	}
};
