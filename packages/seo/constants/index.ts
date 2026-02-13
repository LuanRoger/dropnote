import type { WebApplication, WithContext } from "schema-dts";

export const applicationName = "dropnote.";
export const publisher = "Luan Roger";
export const productionUrl = "https://dropnote.luanroger.dev";

export const jsonLd: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: applicationName,
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  url: productionUrl,
  description: "Create, edit and share text instantly.",
  creator: {
    "@type": "Person",
    name: publisher,
  },
  author: {
    "@type": "Person",
    name: publisher,
  },
  publisher: {
    "@type": "Person",
    name: publisher,
  },
};
