"use client";

import { Controller, type FieldValues } from "react-hook-form";
import type { InputZodProps } from "@/tipes/form-zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const InputFileZod = <TData extends FieldValues>({
	id,
	label,
	form,
	accept,
}: InputZodProps<TData> & { accept?: string }) => {
	return (
		<Controller
			name={id}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
					<Input
						name={field.name}
						type="file"
						placeholder={`Masukkan ${label}`}
						accept={accept}
						onChange={(e) => {
							const file = e.target.files?.[0];
							field.onChange(file);
						}}
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
};

export default InputFileZod;
