import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import type { PageResponse } from "@/tipes/commons";
import type { OrganizationMini } from "@/tipes/organization";
import type { Tunkin } from "@/tipes/tunkin";
import TunkinComponent from "./component";
import TunkinFilterComponent from "./filter";
import { DashboardFilterProvider } from "./filter-provider";

const currentPeriode = () => {
	const now = new Date();
	const tahun = now.getFullYear();
	const bulan = (now.getMonth() + 1).toString().padStart(2, "0");
	return `${tahun}${bulan}`;
};

const DashboardRoutePage = async ({
	searchParams,
}: {
	searchParams: Promise<Record<string, string>>;
}) => {
	const params = await searchParams;
	const { periode } = params;

	if (!periode) {
		const defaultPeriode = currentPeriode();
		return redirect(`/dashboard?periode=${defaultPeriode}`);
	}

	const search = new URLSearchParams(params);
	search.delete("periode");
	const path = `/tunkin/${periode}?${search.toString()}`;

	const result = await (async () => {
		try {
			return await Promise.all([
				apiFetch<OrganizationMini[]>("/organization"),
				apiFetch<PageResponse<Tunkin>>(path),
			]);
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				return "AUTH_ERROR" as const;
			}
			throw error;
		}
	})();

	if (result === "AUTH_ERROR") {
		redirect("/login");
	}

	const [orgs, tunkinData] = result;

	return (
		<DashboardFilterProvider>
			<div className="flex flex-col flex-1 min-h-0 min-w-0 gap-4">
				<TunkinFilterComponent orgs={orgs} />
				<TunkinComponent orgs={orgs} data={tunkinData} />
			</div>
		</DashboardFilterProvider>
	);
};

export default DashboardRoutePage;
