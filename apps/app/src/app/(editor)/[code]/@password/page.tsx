import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { LockIcon } from "lucide-react";
import PasswordInputForm from "./components/password-input-form";

export default function PasswordPage() {
  const formId = "password-form";

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
        <CardContent>
          <PasswordInputForm id={formId} />
        </CardContent>
        <CardFooter>
          <Button form={formId} type="submit">
            Unlock Note
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
