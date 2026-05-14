"use server";

import { apiFetch, safeAction } from "@/lib/api";
import { requireUser } from "@/lib/dal";

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
