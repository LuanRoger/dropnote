import type { ColaborationOptions } from "@repo/editor/types/editor";
import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { checkNoteMultiplayerAccess } from "@/app/actions/multiplayer-server";
import { resolveNoteAccess } from "@/app/actions/notes";
import { getSecurityCodeByNoteCode } from "@/app/actions/security-code";
import RichEditorShell from "@/components/rich-editor-shell";
import { MAX_LENGHT_ADVANCED_NOTE, MAX_LENGHT_BASIC_NOTE } from "@/constants";
import { NotesDatabaseLoadSource } from "@/lib/sources/notes";
import { NoteRoomFullError } from "@/types/errors/notes";
import { mapNotePropertiesToBadges } from "@/utils/badge";
import { generateRandomHexColor } from "@/utils/color";
import { generateRandomName } from "@/utils/name";
import { validateSlug } from "@/utils/slug";
import { env } from "~/env";
import PasswordPage from "./components/password";
import UpdatePasswordCard from "./components/update-password";

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

  const access = await resolveNoteAccess(code);

  if (access === "needs_password") {
    const securityCode = await getSecurityCodeByNoteCode(code);

    if (!securityCode) {
      return <PasswordPage code={code} />;
    }

    return (
      <UpdatePasswordCard
        className="absolute inset-0 top-1/2 mx-auto h-fit w-96 -translate-y-1/2"
        code={code}
      />
    );
  }

  const multiplayerAccessResult = await checkNoteMultiplayerAccess(code);
  if (multiplayerAccessResult.isFull) {
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

  const colabration: ColaborationOptions | undefined =
    multiplayerServerWssUrl && multiplayerServerApiKey
      ? {
          wssUrl: multiplayerServerWssUrl,
          name: generateRandomName(),
          color: generateRandomHexColor(),
          roomName: code,
          token: multiplayerServerApiKey,
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
