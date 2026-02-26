import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { LockIcon } from "lucide-react";
import Image from "next/image";
import { getNoteByCode } from "@/app/actions/notes";
import { getSecurityCodeByNoteCode } from "@/app/actions/security-code";
import passwordBackground from "@/assets/images/password-background.png";
import PasswordCardBody from "./components/password-card-body";

type PasswordPageProps = {
  code: string;
};

export default async function PasswordPage({ code }: PasswordPageProps) {
  const securityCode = await getSecurityCodeByNoteCode(code);
  const note = await getNoteByCode(code);

  const recoveryEmail = note?.ownerEmail ?? undefined;
  const canSendRecoveryPasswordEmail = !securityCode && recoveryEmail;

  return (
    <div className="relative size-full">
      <Image
        alt="Password Background"
        className="absolute -z-10 size-full object-cover opacity-35 blur-md"
        height={500}
        src={passwordBackground}
        width={500}
      />
      <Card className="absolute inset-0 top-1/2 mx-auto h-fit w-96 -translate-y-1/2">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <LockIcon size={14} /> Protected Note
          </CardTitle>
          <CardDescription>
            This note is protected by a password. Please enter the password to
            access the note content.
          </CardDescription>
        </CardHeader>
        <PasswordCardBody
          code={code}
          recoveryEmail={
            canSendRecoveryPasswordEmail ? recoveryEmail : undefined
          }
        />
      </Card>
    </div>
  );
}
