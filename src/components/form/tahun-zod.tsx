"use client"

import { memo } from "react";
import { Controller, type FieldValues } from "react-hook-form";
import type { InputZodProps } from "@/tipes/form-zod";
import { Field, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const TahunItem=memo(({value}:{value:string})=>(
    <SelectItem value={value}>{value}</SelectItem>
));

TahunItem.displayName="TahunItem";

const TAHUN_OPTIONS=Array.from({length:5},(_,i)=>(new Date().getFullYear()-i)).map(String);

const TahunZod = <TData extends FieldValues>({
  id,
  form,
}: InputZodProps<TData>) => {

    return (
      <Controller
        name={id}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Tahun</FieldLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {TAHUN_OPTIONS.map((tahun) => (
                  <TahunItem key={tahun} value={`${tahun}`} />
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      />
    );
}

export default TahunZod;