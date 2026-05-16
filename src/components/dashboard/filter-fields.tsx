import { Building2, Calendar, Grid3x3 } from "lucide-react";
import { memo } from "react";
import OrganizationList from "@/components/form/organization-list";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OrganizationMini } from "@/tipes/organization";

interface FilterFieldsProps {
	periode: string;
	search: string;
	orgId: string;
	orgs: OrganizationMini[];
	onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSelectChange: (id: string, value: string) => void;
}

const FILTER_CONFIG = [
	{
		id: "periode",
		label: "Periode",
		placeholder: "YYYY-MM",
		icon: Calendar,
		type: "search" as const,
		description: "Cari berdasarkan periode",
	},
	{
		id: "search",
		label: "Search Nipam/Nama",
		placeholder: "Search NIPAM / Nama",
		icon: Grid3x3,
		type: "search" as const,
		description: "Cari berdasarkan nomor NIPAM",
	},
];

export const FilterFields = memo(
	({
		periode,
		search,
		orgId,
		orgs,
		onInputChange,
		onSelectChange,
	}: FilterFieldsProps) => {
		return (
			<FieldSet>
				<FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{FILTER_CONFIG.map(
						({ id, label, placeholder, icon: Icon, description }) => (
							<Field key={id}>
								<Label className="text-sm font-medium mb-2 flex items-center gap-2">
									<Icon className="h-4 w-4 text-muted-foreground" />
									{label}
								</Label>
								<Input
									id={id}
									defaultValue={id === "periode" ? periode : search}
									onChange={onInputChange}
									placeholder={placeholder}
									className="w-full transition-colors"
									type={id === "periode" ? "search" : "text"}
									title={description}
								/>
							</Field>
						),
					)}

					<Field>
						<Label className="text-sm font-medium mb-2 flex items-center gap-2">
							<Building2 className="h-4 w-4 text-muted-foreground" />
							Organisasi
						</Label>
						<OrganizationList
							id="orgId"
							onChange={onSelectChange}
							defaultValue={orgId}
							orgs={orgs}
							placeholder="Pilih organisasi"
						/>
					</Field>
				</FieldGroup>
			</FieldSet>
		);
	},
);

FilterFields.displayName = "FilterFields";

export default FilterFields;
