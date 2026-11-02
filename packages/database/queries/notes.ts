/** biome-ignore-all lint/suspicious/noExplicitAny: The body of the note can be any, since we don't know the structure of the note */
import type { Model } from "mongoose";
import { withDatabaseConnection } from "../client";
import { getNotesModel, type NoteModel } from "../schemas/notes";

async function withNotes<T>(
  operation: (notes: Model<NoteModel>) => Promise<T>
): Promise<T> {
  return withDatabaseConnection(async (connection) => {
    const notes = getNotesModel(connection);
    await notes.init();
    return await operation(notes);
  });
}

export async function getNoteByCode(code: string): Promise<NoteModel | null> {
  return withNotes(async (notes) => {
    return await notes.findOne({ code })
      .select(
        "code body isPermanent hasExtendedLimit aiCredits badges expireAt createdAt updatedAt"
      )
      .lean();
  });
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
  return withNotes(async (notes) => {
    const created = await notes.create(data);
    return created.toObject<NoteModel>();
  });
}

export async function updateNote(code: string, body: any) {
  await withNotes(async (notes) => {
    await notes.updateOne({ code }, { body });
  });
}

export async function createOrUpdateNoteBody(code: string, body: any) {
  await withNotes(async (notes) => {
    const note = await notes.findOne({ code })
      .select(
        "code body isPermanent hasExtendedLimit aiCredits badges expireAt createdAt updatedAt"
      )
      .lean();
    if (note) {
      await notes.updateOne({ code }, { body });
    } else {
      await notes.create({ code, body });
    }
  });
}

export async function setNoteAsPermanent(code: string) {
  await withNotes(async (notes) => {
    await notes.updateOne({ code }, { isPermanent: true, expireAt: null });
  });
}

export async function setExtendedLimitForNote(
  code: string,
  hasExtendedLimit: boolean
) {
  await withNotes(async (notes) => {
    await notes.updateOne({ code }, { hasExtendedLimit });
  });
}
