import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
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

const DashboardPage = async ({
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

	const [orgs, tunkinData] = await Promise.all([
		apiFetch<OrganizationMini[]>("/organization/list"),
		apiFetch<PageResponse<Tunkin>>(path),
	]);

	return (
		<DashboardFilterProvider>
			<div className="grid">
				<TunkinFilterComponent orgs={orgs} />
				<TunkinComponent orgs={orgs} data={tunkinData} />
			</div>
		</DashboardFilterProvider>
	);
};

export default DashboardPage;
