"use server";

import { apiFetch } from "@/lib/api";
import type { OrganizationMini } from "@/tipes/organization";

export const fetchOrganization = async (): Promise<OrganizationMini[]> => {
	return apiFetch<OrganizationMini[]>("/organization/list");
};
