/** biome-ignore-all lint/suspicious/noExplicitAny: The body of the note can be any, since we don't know the structure of the note */
import { ensureConnected } from "../client";
import { type NoteModel, Notes } from "../schemas/notes";

export async function getNoteByCode(code: string): Promise<NoteModel | null> {
  await ensureConnected();

  const note = await Notes.findOne({ code })
    .select(
      "code body isPermanent hasExtendedLimit aiCredits badges expireAt createdAt updatedAt"
    )
    .lean();

  return note;
}

export async function createNote(data: {
  code: string;
  body: any;
  badges?: {
    label: string;
    color: string;
    description: string;
    isSpecial?: boolean;
  }[];
  isPermanent?: boolean;
  hasExtendedLimit?: boolean;
  expireAt?: Date;
}): Promise<NoteModel> {
  await ensureConnected();

  const created = await Notes.create(data);

  const obj = created.toObject<NoteModel>();

  return obj;
}

export async function updateNote(code: string, body: any) {
  await ensureConnected();

  await Notes.updateOne({ code }, { body });
}

export async function createOrUpdateNoteBody(code: string, body: any) {
  await ensureConnected();

  const note = await Notes.findOne({ code })
    .select(
      "code body isPermanent hasExtendedLimit aiCredits badges expireAt createdAt updatedAt"
    )
    .lean();
  if (note) {
    await Notes.updateOne({ code }, { body });
  } else {
    await Notes.create({ code, body });
  }
}

export async function setNoteAsPermanent(code: string) {
  await ensureConnected();

  await Notes.updateOne({ code }, { isPermanent: true, expireAt: null });
}

export async function setExtendedLimitForNote(
  code: string,
  hasExtendedLimit: boolean
) {
  await ensureConnected();

  await Notes.updateOne({ code }, { hasExtendedLimit });
}
