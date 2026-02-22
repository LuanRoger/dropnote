"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  CardContent,
  CardFooter,
} from "@repo/design-system/components/ui/card";
import { useTransition } from "react";
import PasswordInputForm from "./password-input-form";

type PasswordCardBodyProps = {
  code: string;
};

export default function PasswordCardBody({ code }: PasswordCardBodyProps) {
  const formId = "password-form";
  const [isPending, startAction] = useTransition();

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
      </CardFooter>
    </>
  );
}
