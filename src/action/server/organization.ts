"use server";

import { getAccessToken } from "@/lib/session";
import { appConfig } from "@/lib/utils";

export const fetchOrganization = async () => {
	const token = await getAccessToken();

	const url = `${appConfig.apiUrl}/organization/list`;
	const req = await fetch(url, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const result = await req.json();
	return result.data;
};
