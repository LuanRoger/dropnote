import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { notFound } from "next/navigation";
import { getSecurityCodeByNoteCode } from "@/app/actions/security-code";
import { obfuscateEmail } from "@/utils/email";
import NoteUpdatePasswordCardBody from "./components/password-update-card-body";

type UpdatePasswordCardProps = {
  code: string;
  className?: string;
};

export default async function UpdatePasswordCard({
  code,
  className,
}: UpdatePasswordCardProps) {
  const securityCode = await getSecurityCodeByNoteCode(code);
  if (!securityCode) {
    notFound();
  }

  const obfuscatedEmail = obfuscateEmail(securityCode.sendToEmail);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Enter the security code</CardTitle>
        <CardDescription>
          <p>
            The security code was sended to email:{" "}
            <span className="font-bold">{obfuscatedEmail}</span>
          </p>
        </CardDescription>
      </CardHeader>
      <NoteUpdatePasswordCardBody code={code} />
    </Card>
  );
}
