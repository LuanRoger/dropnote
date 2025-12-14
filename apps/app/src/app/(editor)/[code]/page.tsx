import { validateSlug } from "@/utils/slug";
import { ensureCreated } from "../../actions/notes";
import Editor from "@/components/editor";
import { notFound } from "next/navigation";

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
