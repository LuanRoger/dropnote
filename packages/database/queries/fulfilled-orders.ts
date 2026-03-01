import { ensureConnected } from "../client";
import {
  type FulfilledOrderModel,
  FulfilledOrders,
} from "../schemas/fulfilled-orders";

export async function createFulfilledOrder(data: {
  sessionId: string;
  noteCode: string;
  features: string[];
}): Promise<FulfilledOrderModel> {
  await ensureConnected();

  const created = await FulfilledOrders.create({
    ...data,
    fulfilledAt: new Date(),
  });

  return created.toObject<FulfilledOrderModel>();
}

export async function isFulfilledOrder(sessionId: string): Promise<boolean> {
  await ensureConnected();

  const order = await FulfilledOrders.exists({ sessionId });

  return order !== null;
}
