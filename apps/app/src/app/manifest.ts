import { manifest as manifestMetadata } from "@repo/seo/manifest";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return manifestMetadata;
}
