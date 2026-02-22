"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@repo/design-system/components/ui/field";
import { Input } from "@repo/design-system/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@repo/design-system/components/ui/input-otp";
import { Controller, useForm } from "react-hook-form";
import { SECURITY_CODE_LENGTH } from "@/constants";
import {
  type PasswordUpdateFormData,
  passwordUpdateFormSchema,
} from "./schema";
import type { TransitionStartFunction } from "react";
import { consumeSecurityCodeAndSetPasswordForNote } from "@/app/actions/security-code";
import { handleError } from "@repo/design-system/lib/utils";

type PasswordUpdateFormParams = {
  code: string;
  startAction: TransitionStartFunction;
  formId?: string;
};

export default function PasswordUpdateForm({
  code,
  startAction,
  formId,
}: PasswordUpdateFormParams) {
  const form = useForm({
    resolver: zodResolver(passwordUpdateFormSchema),
    defaultValues: {
      newPassword: "",
      securityCode: "",
    },
  });

  function handleSubmit(data: PasswordUpdateFormData) {
    const { newPassword, securityCode } = data;

    startAction(async () => {
      try {
        await consumeSecurityCodeAndSetPasswordForNote(
          code,
          securityCode,
          newPassword,
        );
      } catch (error) {
        handleError(error);
      }
    });
  }

  return (
    <form id={formId} onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={form.control}
            name="securityCode"
            render={({ field, fieldState }) => (
              <Field className="flex flex-col">
                <FieldLabel>Security code</FieldLabel>
                <InputOTP
                  maxLength={SECURITY_CODE_LENGTH}
                  pattern={REGEXP_ONLY_DIGITS}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                  </InputOTPGroup>
                </InputOTP>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>New password</FieldLabel>
                <Input {...field} type="password" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
