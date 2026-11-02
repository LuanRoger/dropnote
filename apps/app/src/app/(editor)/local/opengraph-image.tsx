import { generateEditorCodeImage } from "@repo/seo/opengraph/images/editor-code";
import { loadImageFont } from "@/lib/image-font";

export default async function Image() {
  return generateEditorCodeImage("no-save", await loadImageFont());
}
