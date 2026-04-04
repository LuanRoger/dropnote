import mongoose from "mongoose";

export type FulfilledOrderModel = {
  sessionId: string;
  noteCode: string;
  features: string[];
  fulfilledAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export const fulfilledOrdersSchema = new mongoose.Schema(
  {
    sessionId: { type: String, unique: true, required: true, index: true },
    noteCode: { type: String, required: true, index: true },
    features: { type: [String], default: [] },
    fulfilledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const FulfilledOrders =
  (mongoose.models.FulfilledOrders as mongoose.Model<FulfilledOrderModel>) ||
  mongoose.model<FulfilledOrderModel>("FulfilledOrders", fulfilledOrdersSchema);
