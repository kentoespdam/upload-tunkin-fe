"use client";

import { Controller, type FieldValues } from "react-hook-form";
import type { InputZodProps } from "@/tipes/form-zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

const InputFileZod = <TData extends FieldValues>({
  id,
  label,
  form,
}: InputZodProps<TData>) => {
  return (
    <Controller
      name={id}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            {...field}
            type="file"
            placeholder={`Masukkan ${label}`}
            onChange={(e) => {
              field.onChange(e.target.files);
            }}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default InputFileZod;