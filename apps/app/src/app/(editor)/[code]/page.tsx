import type { ColaborationOptions } from "@repo/editor/types/editor";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  checkNoteMultiplayerAccess,
  getNoteMultiplayerToken,
} from "@/app/actions/multiplayer-server";
import RichEditorShell from "@/components/rich-editor-shell";
import { MAX_LENGHT_ADVANCED_NOTE, MAX_LENGHT_BASIC_NOTE } from "@/constants";
import { NotesDatabaseLoadSource } from "@/lib/sources/notes";
import { NoteRoomFullError } from "@/types/errors/notes";
import { generateRandomHexColor } from "@/utils/color";
import { generateRandomName } from "@/utils/name";
import { mapNotePropertiesToBadges } from "@/utils/notes";
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
  if (multiplayerAccessResult.isFull) {
    throw new NoteRoomFullError(code);
  }

  const multiplayerServerWssUrl = env.HOCUSPOCUS_WSS_URL;

  const loader = new NotesDatabaseLoadSource(code);
  const note = await loader.loadNote();

  const initialValue = note.body;
  const maxLength = note.hasExtendedLimit
    ? MAX_LENGHT_ADVANCED_NOTE
    : MAX_LENGHT_BASIC_NOTE;
  const expireAt = note.expireAt;
  const badges = mapNotePropertiesToBadges(note);

  const colabration: ColaborationOptions | undefined = multiplayerServerWssUrl
    ? {
        wssUrl: multiplayerServerWssUrl,
        name: generateRandomName(),
        color: generateRandomHexColor(),
        roomName: code,
        token: getNoteMultiplayerToken.bind(null, code),
      }
    : undefined;

  return (
    <RichEditorShell
      code={code}
      initialValue={initialValue}
      noteSource="database"
      options={{
        maxLength,
        expireAt,
        badges,
        colabration,
      }}
    />
  );
}
