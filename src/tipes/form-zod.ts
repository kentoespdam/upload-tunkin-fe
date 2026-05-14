import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type ZodFieldProps<T extends FieldValues> = {
	id: Path<T>;
	form: UseFormReturn<T>;
	label?: string;
	className?: string;
	placeholder?: string;
} & (
	| {
			variant: "text";
			inputType?: "text" | "password" | "number" | "email";
	  }
	| {
			variant: "select";
			options: { label: string; value: string }[];
	  }
	| {
			variant: "file";
			accept?: string;
	  }
);
