import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { LockIcon } from "lucide-react";
import PasswordCardBody from "./components/password-card-body";

export default async function PasswordPage({ params }: PageProps<"/[code]">) {
  const { code } = await params;

  return (
    <div className="flex size-full items-center justify-center">
      <Card className="min-w-96">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-1">
            <LockIcon size={14} /> Protected Note
          </CardTitle>
          <CardDescription>
            This note is protected by a password. Please enter the password to
            access the note content.
          </CardDescription>
        </CardHeader>
        <PasswordCardBody code={code} />
      </Card>
    </div>
  );
}
