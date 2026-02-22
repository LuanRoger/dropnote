import { Button } from "@repo/design-system/components/ui/button";
import {
  CardContent,
  CardFooter,
} from "@repo/design-system/components/ui/card";
import PasswordUpdateForm from "../password-update-form";

type NoteUpdatePasswordCardBodyProps = {
  code: string;
}

export default function NoteUpdatePasswordCardBody({ code }: NoteUpdatePasswordCardBodyProps) {
  const formId = "note-update-password-form";

  return (
    <>
      <CardContent>
        <PasswordUpdateForm code={code} formId={formId} />
      </CardContent>
      <CardFooter>
        <Button form={formId} type="submit">Update password</Button>
      </CardFooter>
    </>
  );
}
