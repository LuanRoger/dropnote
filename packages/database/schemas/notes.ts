import mongoose from "mongoose";

export interface NoteModel {
  code: string;
  // biome-ignore lint/suspicious/noExplicitAny: The body of the note can be any, since we don't know the structure of the note
  body: any;
  isPermanent: boolean;
  hasPassword: boolean;
  password: string | null;
  hasExtendedLimit: boolean;
  aiCredits: number;
  badges: {
    label: string;
    color: string;
    description: string;
    isSpecial: boolean;
  };
  expireAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export const notesSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true, index: true },
    body: Object,
    isPermanent: { type: Boolean, default: false },
    hasPassword: { type: Boolean, default: false },
    hasExtendedLimit: { type: Boolean, default: false },
    password: { type: String, default: null, select: false },
    aiCredits: { type: Number, default: 0 },
    badges: {
      type: [
        {
          label: String,
          color: String,
          description: String,
          isSpecial: Boolean,
        },
      ],
      default: [],
    },
    expireAt: { type: Date, expires: 0 },
  },
  { timestamps: true },
);

export const Notes =
  (mongoose.models.Notes as mongoose.Model<NoteModel>) ||
  mongoose.model<NoteModel>("Notes", notesSchema);
