"use client";

import type { FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ZodFieldProps } from "@/tipes/form-zod";

export function ZodField<T extends FieldValues>(props: ZodFieldProps<T>) {
	const { id, form, label, className, variant, placeholder } = props;

	return (
		<Controller
			control={form.control}
			name={id}
			render={({ field, fieldState }) => {
				const hasError = !!fieldState.error;

				return (
					<Field className={className} data-invalid={hasError}>
						{label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
						<FieldContent>
							{variant === "text" && (
								<Input
									{...field}
									id={id}
									type={props.inputType || "text"}
									placeholder={placeholder}
									onChange={(e) => {
										const val = e.target.value;
										if (props.inputType === "number") {
											field.onChange(val === "" ? "" : Number(val));
										} else {
											field.onChange(val);
										}
									}}
								/>
							)}

							{variant === "select" && (
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									value={field.value}
								>
									<SelectTrigger id={id}>
										<SelectValue placeholder={placeholder || "Pilih opsi"} />
									</SelectTrigger>
									<SelectContent>
										{props.options.map((opt) => (
											<SelectItem key={opt.value} value={opt.value}>
												{opt.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}

							{variant === "file" && (
								<Input
									id={id}
									type="file"
									accept={props.accept}
									onChange={(e) => {
										const file = e.target.files?.[0];
										field.onChange(file || "");
									}}
								/>
							)}

							<FieldError errors={[fieldState.error]} />
						</FieldContent>
					</Field>
				);
			}}
		/>
	);
}
