"use client";

import {
  Field,
  FieldError,
  FieldLabel,
} from "@repo/design-system/components/ui/field";
import { Input } from "@repo/design-system/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { type NotePasswordInput, notePasswordInputFormSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";

type PasswordInputFormProps = {
  id?: string;
};

export default function PasswordInputForm({ id }: PasswordInputFormProps) {
  const form = useForm({
    resolver: zodResolver(notePasswordInputFormSchema),
    defaultValues: {
      password: "",
    },
  });

  function handleSubmit(data: NotePasswordInput) {
    console.log("submit password", data);
  }

  return (
    <form id={id} onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Enter the password</FieldLabel>
            <Input {...field} type="password" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
