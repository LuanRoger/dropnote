import type { Author } from "next/dist/lib/metadata/types/metadata-types";
import type { WebApplication, WithContext } from "schema-dts";

export const applicationName = "dropnote.";
export const publisher = "Luan Roger";
export const author: Author = {
  name: publisher,
  url: "https://www.luanroger.dev",
};
export const productionUrl = "https://dropnote.luanroger.dev";
export const keywords = [
  "online notepad",
  "no login notes",
  "share text",
  "disposable notes",
  "open source notepad",
  "AI writing assistant",
  "bloco de notas online",
];

export const jsonLd: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: applicationName,
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Any",
  url: productionUrl,
  description:
    "Create, edit, and share notes instantly without login. A fast, open-source WYSIWYG notepad with AI capabilities.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "No login required",
    "Real-time collaboration",
    "AI writing assistant",
    "Open-source",
    "Password protection",
  ],
  browserRequirements: "Requires JavaScript. Requires HTML5.",
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
