import { notFound } from "next/navigation";
import { resolveNoteAccess } from "@/app/actions/notes";
import { validateSlug } from "@/utils/slug";

type LayoutProps = Readonly<{
  params: Promise<{ code: string }>;
  editor: React.ReactNode;
  password: React.ReactNode;
}>;

export default async function Layout({
  params,
  editor,
  password,
}: LayoutProps) {
  const { code } = await params;
  const isValidCode = validateSlug(code);
  if (!isValidCode) {
    notFound();
  }

  const access = await resolveNoteAccess(code);

  if (access === "needs_password") {
    return password;
  }

  return editor;
}
