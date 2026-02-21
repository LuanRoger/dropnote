import mongoose from "mongoose";

export type SecurityCodeModel = {
  noteCode: string;
  securityCode: string;
  sendToEmail: string;
  isUsed: boolean;
  expireAt: Date;
};

export const securityCodeSchema = new mongoose.Schema(
  {
    noteCode: { type: String, required: true, index: true },
    securityCode: { type: String, required: true },
    sendToEmail: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    expireAt: { type: Date, expires: 0 },
  },
  { timestamps: true },
);

export const SecurityCodes =
  (mongoose.models.SecurityCodes as mongoose.Model<SecurityCodeModel>) ||
  mongoose.model<SecurityCodeModel>("SecurityCodes", securityCodeSchema);
