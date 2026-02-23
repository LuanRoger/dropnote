"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  CardContent,
  CardFooter,
} from "@repo/design-system/components/ui/card";
import { handleError } from "@repo/design-system/lib/utils";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createSecurityCodeForNote } from "@/app/actions/security-code";
import { obfuscateEmail } from "@/utils/email";
import PasswordInputForm from "./password-input-form";

type PasswordCardBodyProps = {
  code: string;
  recoveryEmail?: string;
};

export default function PasswordCardBody({
  code,
  recoveryEmail,
}: PasswordCardBodyProps) {
  const formId = "password-form";
  const [isPending, startAction] = useTransition();
  const [sended, setIsSended] = useState(false);

  function sendSecurityCode() {
    if (!recoveryEmail) {
      return;
    }

    const obfuscatedEmail = obfuscateEmail(recoveryEmail);
    startAction(async () => {
      try {
        await createSecurityCodeForNote(code, recoveryEmail, "update");
        setIsSended(true);
        toast.success(`Security code sent to email ${obfuscatedEmail}`);
      } catch (error) {
        handleError(error);
      }
    });
  }

  return (
    <>
      <CardContent>
        <PasswordInputForm
          code={code}
          formId={formId}
          startAction={startAction}
        />
      </CardContent>
      <CardFooter>
        <Button disabled={isPending} form={formId} type="submit">
          Unlock note
        </Button>
        {recoveryEmail && !sended && (
          <Button
            disabled={isPending}
            form={formId}
            onClick={sendSecurityCode}
            type="button"
            variant="link"
          >
            Forget password?
          </Button>
        )}
      </CardFooter>
    </>
  );
}
