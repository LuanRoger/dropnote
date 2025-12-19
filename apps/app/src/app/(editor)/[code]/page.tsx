import { notFound } from "next/navigation";
import Editor from "@/components/editor";
import { validateSlug } from "@/utils/slug";
import { ensureCreated } from "../../actions/notes";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const isValidCode = validateSlug(code);
  if (!isValidCode) {
    notFound();
  }

  const note = await ensureCreated(code);
  const body = note?.body;

  return <Editor code={code} initialValue={body} />;
}
