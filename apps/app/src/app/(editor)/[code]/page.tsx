import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ensureCreated } from "@/app/actions/notes";
import RichEditorShell from "@/components/rich-editor-shell";
import { validateSlug } from "@/utils/slug";

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

  return <RichEditorShell code={code} initialValue={body} />;
}
