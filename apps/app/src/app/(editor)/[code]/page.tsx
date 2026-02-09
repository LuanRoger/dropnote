import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RichEditorShell from "@/components/rich-editor-shell";
import { validateSlug } from "@/utils/slug";
import { NotesDatabaseLoadSource } from "@/lib/sources/notes";

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

  const wssUrl = process.env.HOCUSPOCUS_WSS_URL;
  const loader = new NotesDatabaseLoadSource(code);
  const initialValue = await loader.load();

  return (
    <RichEditorShell
      code={code}
      initialValue={initialValue}
      noteSource="database"
      wssUrl={wssUrl}
    />
  );
}
