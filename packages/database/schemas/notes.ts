import mongoose from "mongoose";

export const notesSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    body: Object,
  },
  { timestamps: true }
);
