import { redirect } from "next/navigation";
import { Suspense } from "react";
import { apiFetch } from "@/lib/api";
import type { OrganizationMini } from "@/tipes/organization";
import TunkinComponent from "./component";
import TunkinFilterComponent from "./filter";

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
	const { periode } = await searchParams;
	if (!periode) {
		const defaultPeriode = currentPeriode();
		return redirect(`/dashboard?periode=${defaultPeriode}`);
	}

	const orgs = await apiFetch<OrganizationMini[]>("/organization/list");

	return (
		<div className="grid">
			<TunkinFilterComponent orgs={orgs} />
			<Suspense fallback={<div>Loading...</div>}>
				<TunkinComponent orgs={orgs} />
			</Suspense>
		</div>
	);
};

export default DashboardPage;
