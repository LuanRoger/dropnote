import { ensureCreated } from "../../actions/notes";
import Editor from "@/components/editor";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const note = await ensureCreated(code);
  const body = note?.body;

  return <Editor code={code} initialValue={body} />;
}
