import { generateEditorCodeImage } from "@repo/seo/opengraph/images/editor-code";

export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return generateEditorCodeImage(code);
}
