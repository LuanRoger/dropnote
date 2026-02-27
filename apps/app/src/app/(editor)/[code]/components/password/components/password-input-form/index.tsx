"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@repo/design-system/components/ui/field";
import { Input } from "@repo/design-system/components/ui/input";
import { handleError } from "@repo/design-system/lib/utils";
import { Controller, useForm } from "react-hook-form";
import { tryPasswordAccess } from "@/app/actions/notes";
import { type NotePasswordInput, notePasswordInputFormSchema } from "./schema";

type PasswordInputFormProps = {
  formId?: string;
  startAction: React.TransitionStartFunction;
  code: string;
};

export default function PasswordInputForm({
  formId,
  startAction,
  code,
}: PasswordInputFormProps) {
  const form = useForm({
    resolver: zodResolver(notePasswordInputFormSchema),
    defaultValues: {
      password: "",
    },
  });

  function handleSubmit(data: NotePasswordInput) {
    const { password } = data;
    startAction(async () => {
      try {
        await tryPasswordAccess(code, password);
      } catch (error) {
        handleError(error);
      }
    });
  }

  return (
    <form id={formId} onSubmit={form.handleSubmit(handleSubmit)}>
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
