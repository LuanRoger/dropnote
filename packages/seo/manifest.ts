import type { MetadataRoute } from "next";
import { applicationName } from "./constants";

export const manifest: MetadataRoute.Manifest = {
  name: applicationName,
  short_name: "Notes",
  description:
    "A lightning-fast, zero-login notepad for your daily ideas and tasks.",
  start_url: "/",
  display: "standalone",
  background_color: "#000000",
  theme_color: "#000000",
  categories: ["productivity", "utilities", "education"],
  icons: [
    {
      src: "/icon?<generated>",
      type: "image/png",
      sizes: "32x32",
    },
    {
      src: "/icon?<generated>",
      type: "image/png",
      sizes: "192x192",
    },
    {
      src: "/icon?<generated>",
      type: "image/png",
      sizes: "512x512",
      purpose: "maskable",
    },
  ],
};
