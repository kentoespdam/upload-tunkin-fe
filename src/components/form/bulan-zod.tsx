"use client";

import { memo } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import type { InputZodProps } from "@/tipes/form-zod";
import { Field, FieldLabel } from "../ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const BULAN_OPTIONS = [
	{ value: "01", label: "Januari" },
	{ value: "02", label: "Februari" },
	{ value: "03", label: "Maret" },
	{ value: "04", label: "April" },
	{ value: "05", label: "Mei" },
	{ value: "06", label: "Juni" },
	{ value: "07", label: "Juli" },
	{ value: "08", label: "Agustus" },
	{ value: "09", label: "September" },
	{ value: "10", label: "Oktober" },
	{ value: "11", label: "November" },
	{ value: "12", label: "Desember" },
];

const BulanItem = memo(({ value, label }: { value: string; label: string }) => (
	<SelectItem value={value}>{label}</SelectItem>
));

BulanItem.displayName = "BulanItem";

const BulanZod = <TData extends FieldValues>({
	id,
	form,
}: InputZodProps<TData>) => {
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>Bulan</FieldLabel>
					<Select onValueChange={field.onChange} value={field.value}>
						<SelectTrigger>
							<SelectValue placeholder="Pilih Bulan" />
						</SelectTrigger>
						<SelectContent>
							{BULAN_OPTIONS.map((item) => (
								<BulanItem
									key={item.value}
									value={item.value}
									label={item.label}
								/>
							))}
						</SelectContent>
					</Select>
				</Field>
			)}
		/>
	);
};

export default BulanZod;
