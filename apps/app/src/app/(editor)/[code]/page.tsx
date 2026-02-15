import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RichEditorShell from "@/components/rich-editor-shell";
import { MAX_LENGHT_BASIC_NOTE } from "@/constants";
import { NotesDatabaseLoadSource } from "@/lib/sources/notes";
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

  const wssUrl = process.env.HOCUSPOCUS_WSS_URL;
  const loader = new NotesDatabaseLoadSource(code);
  const note = await loader.loadNote();

  const initialValue = note.body;

  const maxLength = MAX_LENGHT_BASIC_NOTE;

  return (
    <RichEditorShell
      code={code}
      initialValue={initialValue}
      maxLength={maxLength}
      noteSource="database"
      wssUrl={wssUrl}
    />
  );
}
