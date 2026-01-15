import type { MetadataRoute } from "next";
import { applicationName } from "./constants";

export const manifest: MetadataRoute.Manifest = {
  name: applicationName,
  short_name: applicationName,
  description: applicationName,
  start_url: "/",
  display: "standalone",
  background_color: "black",
  theme_color: "black",
  icons: [
    {
      src: "/icon?<generated>",
      type: "image/png",
      sizes: "32x32",
    },
  ],
};
