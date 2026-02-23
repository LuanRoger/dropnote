import { notFound } from "next/navigation";
import { resolveNoteAccess } from "@/app/actions/notes";
import { getSecurityCodeByNoteCode } from "@/app/actions/security-code";
import { validateSlug } from "@/utils/slug";

type LayoutProps = Readonly<{
  params: Promise<{ code: string }>;
  editor: React.ReactNode;
  password: React.ReactNode;
  upassword: React.ReactNode;
}>;

export default async function Layout({
  params,
  editor,
  password,
  upassword: updatePassword,
}: LayoutProps) {
  const { code } = await params;
  const isValidCode = validateSlug(code);
  if (!isValidCode) {
    notFound();
  }

  const access = await resolveNoteAccess(code);

  if (access === "needs_password") {
    const securityCode = await getSecurityCodeByNoteCode(code);
    if (!securityCode) {
      return password;
    }

    return updatePassword;
  }

  return editor;
}
