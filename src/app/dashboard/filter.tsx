"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import OrganizationList from "@/components/form/organization-list";
import {
	Field,
	FieldGroup,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDebounceCallback } from "@/hooks/use-debounce-callback";
import TunkinFormDialog from "./form-dialog";

const useTunkinFilter = () => {
	const params = useSearchParams();
	const { replace } = useRouter();

	const { periode, nipam, nama, orgId } = useMemo(
		() => ({
			periode: params.get("periode") ?? "",
			nipam: params.get("nipam") ?? "",
			nama: params.get("nama") ?? "",
			orgId: params.get("orgId") ?? "",
		}),
		[params],
	);

	const replaceUrl = useCallback(
		(field: string, value: string) => {
			const search = new URLSearchParams(params);
			if (!["page", "size"].includes(field)) {
				search.delete("page");
				search.delete("size");
			}
			if (value === "") search.delete(field);
			else search.set(field, value);
			replace(`?${search.toString()}`);
		},
		[params, replace],
	);

	const debounceSearch = useDebounceCallback(replaceUrl, 500);

	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		debounceSearch(id, value);
	};

	const selectChange = (id: string, value: string) => {
		debounceSearch(id, value);
	};

	return {
		periode,
		nipam,
		nama,
		orgId,
		changeHandler,
		selectChange
	};
};
const TunkinFilterComponent = () => {
	const { periode, nipam, nama, orgId, changeHandler, selectChange } = useTunkinFilter();
	return (
		<FieldSet className="pb-2">
			<FieldLegend>Filter</FieldLegend>
			<FieldGroup className="max-w-full flex flex-wrap flex-row justify-start gap-2 mb-2">
				<Field className="w-fit">
					<Input
						id="periode"
						defaultValue={periode}
						onChange={changeHandler}
						placeholder="Periode"
					/>
				</Field>
				<Field className="w-fit">
					<Input
						id="nipam"
						defaultValue={nipam}
						onChange={changeHandler}
						placeholder="Nipam"
					/>
				</Field>
				<Field className="w-fit">
					<Input
						id="nama"
						defaultValue={nama}
						onChange={changeHandler}
						placeholder="Nama"
					/>
				</Field>
				<Field className="w-fit">
					<OrganizationList
						id="orgId"
						onChange={selectChange}
						defaultValue={orgId}
					/>
				</Field>
				<Field className="w-fit">
					<TunkinFormDialog />
				</Field>
			</FieldGroup>
		</FieldSet>
	);
};

export default TunkinFilterComponent;
