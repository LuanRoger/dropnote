import merge from "lodash.merge";
import type { Metadata } from "next";
import { applicationName, productionUrl, publisher } from "./constants";

type MetadataGenerator = Omit<Metadata, "description" | "title"> & {
  title?: string;
  description: string;
};

const author: Metadata["authors"] = {
  name: "Luan Roger",
  url: "https://www.luanroger.dev/",
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
    metadataBase: productionUrl,
    authors: [author],
    creator: author.name,
    formatDetection: {
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: parsedTitle,
    },
    openGraph: {
      title: parsedTitle,
      description,
      type: "website",
      siteName: applicationName,
      locale: "en_US",
    },
    publisher,
  };

  const metadata: Metadata = merge(defaultMetadata, properties);
  return metadata;
};
