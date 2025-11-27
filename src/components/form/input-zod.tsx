"use client"

import { useCallback } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import type { InputZodProps } from "@/tipes/form-zod";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";


const InputZod = <TData extends FieldValues>({
  id,
  form,
  readonly,
  label,
  className,
  inputType = "text",
}: InputZodProps<TData>) => {
  const handleChange = useCallback(
    (
      fieldOnChange: (value: string | number) => void,
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      if (inputType === "number" || inputType === "float") {
        fieldOnChange(Number(event.target.value));
      } else {
        fieldOnChange(event.target.value);
      }
    },
    [inputType],
  );

  const getInputType = useCallback(() => {
    if (!inputType) return undefined;
    switch (inputType) {
      case "float":
        return "number";
      case "hidden":
        return "hidden";
      default:
        return inputType;
    }
  }, [inputType]);

  const isHidden = inputType === "hidden";
  const computedInputType = getInputType();
  return (
    <Controller
      name={id}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <Input
            {...field}
            id={field.name}
            type={computedInputType}
            placeholder={isHidden ? "" : `Masukkan ${label}`}
            readOnly={readonly}
            className={cn(
              {
                "cursor-not-allowed bg-secondary text-secondary-foreground":
                  readonly,
                hidden: isHidden,
              },
              className,
            )}
            onChange={(event) => handleChange(field.onChange, event)}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
export default InputZod;