import mongoose from "mongoose";

export interface NoteModel {
  code: string;
  // biome-ignore lint/suspicious/noExplicitAny: The body of the note can be any, since we don't know the structure of the note
  body: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export const notesSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    body: Object,
  },
  { timestamps: true },
);

export const Notes =
  (mongoose.models.Notes as mongoose.Model<NoteModel>) ||
  mongoose.model<NoteModel>("Notes", notesSchema);
