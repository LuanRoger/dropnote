"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/design-system/components/ui/alert-dialog";
import { Button } from "@repo/design-system/components/ui/button";
import {
  CardContent,
  CardFooter,
} from "@repo/design-system/components/ui/card";
import { handleError } from "@repo/design-system/lib/utils";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createSecurityCodeForNote } from "@/app/actions/security-code";
import { SECURITY_CODE_EXPIRE_TIME_MINUTES } from "@/constants";
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
  const obsfuscatedEmail = recoveryEmail ? obfuscateEmail(recoveryEmail) : null;

  const [isPending, startAction] = useTransition();
  const [sended, setIsSended] = useState(false);

  function sendSecurityCode() {
    if (!recoveryEmail) {
      return;
    }

    const obfuscatedEmail = obfuscateEmail(recoveryEmail);
    startAction(async () => {
      try {
        await createSecurityCodeForNote(code, "update", recoveryEmail, true);
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
        {obsfuscatedEmail && !sended && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isPending} type="button" variant="link">
                Forget password?
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Send security code to email?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <p>
                    You will receive a security code that will allow you to
                    create a new password for the note.
                    <br />
                    Do you want to send the security code to the email{" "}
                    <strong>{obfuscateEmail(obsfuscatedEmail)}</strong>?
                    <br />
                    The code will be valid for{" "}
                    <strong>{SECURITY_CODE_EXPIRE_TIME_MINUTES} minutes</strong>{" "}
                    and you will not be able to send another code until the
                    current one expires.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={sendSecurityCode}>
                  Send
                </AlertDialogAction>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </>
  );
}
