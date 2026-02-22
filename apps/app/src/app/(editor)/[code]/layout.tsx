import { notFound } from "next/navigation";
import { resolveNoteAccess } from "@/app/actions/notes";
import {
  checkIfNoteHasSecurityCode,
  createSecurityCodeForNote,
  findSecurityCodeByNoteCode,
} from "@/app/actions/security-code";
import { validateSlug } from "@/utils/slug";

type LayoutProps = Readonly<{
  params: Promise<{ code: string }>;
  editor: React.ReactNode;
  password: React.ReactNode;
  updatepassword: React.ReactNode;
}>;

export default async function Layout({
  params,
  editor,
  password,
  updatepassword: updatePassword,
}: LayoutProps) {
  const { code } = await params;
  const isValidCode = validateSlug(code);
  if (!isValidCode) {
    notFound();
  }

  const haveSecurityCodePending = await findSecurityCodeByNoteCode(code);
  if (haveSecurityCodePending) {
    return updatePassword;
  }

  const access = await resolveNoteAccess(code);

  if (access === "needs_password") {
    return password;
  }

  return editor;
}
