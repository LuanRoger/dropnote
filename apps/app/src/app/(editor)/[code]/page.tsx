import { notFound } from "next/navigation";
import Editor from "@/components/editor";
import { validateSlug } from "@/utils/slug";
import { ensureCreated } from "../../actions/notes";
import { Metadata } from "next";
import { createMetadata } from "@repo/seo/metadata";

type PageProps = {
  params: Promise<{
    code: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { code } = await params;

  return createMetadata({
    title: code,
    description: `Editing note with code: ${code}`,
  });
};

export default async function Page({ params }: PageProps) {
  const { code } = await params;

  const isValidCode = validateSlug(code);
  if (!isValidCode) {
    notFound();
  }

  const note = await ensureCreated(code);
  const body = note?.body;

  return <Editor code={code} initialValue={body} />;
}
