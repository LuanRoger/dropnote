import { ensureCreated } from "../actions/notes";
import Editor from "@/components/editor";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  await ensureCreated(code);

  return (
    <div className="h-screen w-full" data-registry="plate">
      <Editor code={code} />
    </div>
  );
}
