import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { checkNoteMultiplayerAccess } from "@/app/actions/multiplayer-server";
import RichEditorShell from "@/components/rich-editor-shell";
import { MAX_LENGHT_ADVANCED_NOTE, MAX_LENGHT_BASIC_NOTE } from "@/constants";
import { NotesDatabaseLoadSource } from "@/lib/sources/notes";
import { NoteRoomFullError } from "@/types/errors";
import { mapNotePropertiesToBadges } from "@/utils/badge";
import { validateSlug } from "@/utils/slug";
import { env } from "~/env";

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

  const multiplayerAccessResult = await checkNoteMultiplayerAccess(code);
  if (multiplayerAccessResult.status === "error") {
    throw multiplayerAccessResult.error;
  }

  const multiplayerAccessData = multiplayerAccessResult.data;
  if (multiplayerAccessData.isFull) {
    throw new NoteRoomFullError(code);
  }

  const multiplayerServerWssUrl = env.HOCUSPOCUS_WSS_URL;
  const multiplayerServerApiKey = env.HOCUSPOCUS_API_KEY;

  const loader = new NotesDatabaseLoadSource(code);
  const note = await loader.loadNote();

  const initialValue = note.body;
  const maxLength = note.hasExtendedLimit
    ? MAX_LENGHT_ADVANCED_NOTE
    : MAX_LENGHT_BASIC_NOTE;
  const expireAt = note.expireAt;
  const badges = mapNotePropertiesToBadges(note);

  return (
    <RichEditorShell
      badges={badges}
      code={code}
      expireAt={expireAt}
      initialValue={initialValue}
      maxLength={maxLength}
      noteSource="database"
      wssUrl={multiplayerServerWssUrl}
      apiKey={multiplayerServerApiKey}
    />
  );
}
