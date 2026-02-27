import merge from "lodash.merge";
import type { Metadata } from "next";
import {
  applicationName,
  productionUrl,
  publisher,
  keywords,
  author,
} from "./constants";

type MetadataGenerator = Omit<Metadata, "description" | "title"> & {
  title?: string;
  description: string;
};

export const createMetadata = ({
  title,
  description,
  ...properties
}: MetadataGenerator): Metadata => {
  const parsedTitle = title ? `${title} | ${applicationName}` : applicationName;

  const defaultMetadata: Metadata = {
    title: parsedTitle,
    description,
    applicationName,
    metadataBase: new URL(productionUrl),
    keywords,
    authors: [author],
    creator: author.name,
    publisher,
    formatDetection: {
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: parsedTitle,
    },
    openGraph: {
      title: parsedTitle,
      description,
      type: "website",
      siteName: applicationName,
      locale: "en_US",
      url: productionUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: parsedTitle,
      description,
    },
  };

  const metadata: Metadata = merge(defaultMetadata, properties);
  return metadata;
};
