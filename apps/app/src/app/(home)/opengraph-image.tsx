import { generateHomeImage } from "@repo/seo/opengraph/images/home";
import { loadImageFont } from "@/lib/image-font";

export default async function Image() {
  return generateHomeImage(await loadImageFont());
}
