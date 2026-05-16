"use server";

import { apiFetch, safeAction } from "@/lib/api";
import { requireUser } from "@/lib/dal";

export const cekExistingTunkin = async (
	periode: string,
): Promise<{ exists: boolean; count: number }> => {
	await requireUser();
	return apiFetch<{ exists: boolean; count: number }>(
		`/tunkin/exists/${periode}`,
	);
};

export const doUpload = async (formData: FormData) => {
	return safeAction(() =>
		apiFetch<unknown>("/tunkin/upload", {
			method: "POST",
			body: formData,
		}),
	);
};
