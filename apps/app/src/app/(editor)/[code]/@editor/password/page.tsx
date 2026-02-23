import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { notFound } from "next/navigation";
import { findSecurityCodeByNoteCode } from "@/app/actions/security-code";
import NoteUpdatePasswordCardBody from "./components/password-update-card-body";

export default async function NotePasswordPage({
  params,
}: PageProps<"/[code]">) {
  const { code } = await params;
  const securityCode = await findSecurityCodeByNoteCode(code);
  if (securityCode === null) {
    notFound();
  }

  return (
    <Card className="absolute inset-0 top-1/2 mx-auto h-fit w-96 -translate-y-1/2">
      <CardHeader>
        <CardTitle>Enter the security code</CardTitle>
        <CardDescription>
          <p>
            The security code was sended to email:{" "}
            <span className="font-bold">{securityCode.sendToEmail}</span>
          </p>
        </CardDescription>
      </CardHeader>
      <NoteUpdatePasswordCardBody code={code} />
    </Card>
  );
}
