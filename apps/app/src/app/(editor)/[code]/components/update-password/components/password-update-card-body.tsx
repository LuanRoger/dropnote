"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  CardContent,
  CardFooter,
} from "@repo/design-system/components/ui/card";
import { useTransition } from "react";
import PasswordUpdateForm from "./password-update-form";

type NoteUpdatePasswordCardBodyProps = {
  code: string;
};

export default function NoteUpdatePasswordCardBody({
  code,
}: NoteUpdatePasswordCardBodyProps) {
  const formId = "note-update-password-form";
  const [isPending, startAction] = useTransition();

  return (
    <>
      <CardContent>
        <PasswordUpdateForm
          code={code}
          formId={formId}
          startAction={startAction}
        />
      </CardContent>
      <CardFooter>
        <Button disabled={isPending} form={formId} type="submit">
          Update password
        </Button>
      </CardFooter>
    </>
  );
}
