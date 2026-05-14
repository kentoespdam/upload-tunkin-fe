"use server";

import { apiFetch, safeAction } from "@/lib/api";
import { requireUser } from "@/lib/dal";
import type { PageResponse } from "@/tipes/commons";
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
	await requireUser();
	return apiFetch<{ is_exist: boolean }>(`/tunkin/exists/${periode}`);
};

export const doUpload = async (formData: FormData) => {
	return safeAction(() =>
		apiFetch<unknown>("/tunkin/upload", {
			method: "POST",
			body: formData,
		}),
	);
};
