import type {
	FieldValues,
	Path,
	UseFormRegisterReturn,
	UseFormReturn,
} from "react-hook-form";

export type CommonInputProps<TData extends FieldValues> = {
	id: Path<TData>;
	form: UseFormReturn<TData>;
	readonly?: boolean;
	label?: string;
	className?: string;
};

type TextInputType =
	| "text"
	| "number"
	| "float"
	| "email"
	| "password"
	| "hidden";

export type BaseZodProps<TData extends FieldValues> =
	CommonInputProps<TData> & {
		inputType?: undefined;
	};

export type InputTextZodProps<TData extends FieldValues> =
	CommonInputProps<TData> & {
		inputType: TextInputType;
	};

export type InputFileZodProps<TData extends FieldValues> =
	CommonInputProps<TData> & {
		inputType: "file";
		fileRef: UseFormRegisterReturn;
	};

export type InputZodProps<TData extends FieldValues> =
	| BaseZodProps<TData>
	| InputTextZodProps<TData>
	| InputFileZodProps<TData>;
