import { connectDB } from "./db";
import { Order } from "./models/Order";
import type { Order as OrderType } from "./types";

/*
  Order data helpers. Plain Mongoose queries returning JSON-safe
  objects for the account and admin pages.
*/

function toPlain(doc: Record<string, unknown>): OrderType {
  return {
    _id: String(doc._id),
    reference: doc.reference as string,
    items: ((doc.items as Record<string, unknown>[]) || []).map((i) => ({
      productId: String(i.productId),
      name: i.name as string,
      image: i.image as string,
      price: i.price as number,
      size: i.size as string | undefined,
      quantity: i.quantity as number,
    })),
    shippingAddress: doc.shippingAddress as OrderType["shippingAddress"],
    subtotal: doc.subtotal as number,
    shipping: doc.shipping as number,
    total: doc.total as number,
    paymentStatus: doc.paymentStatus as OrderType["paymentStatus"],
    orderStatus: doc.orderStatus as OrderType["orderStatus"],
    createdAt: String(doc.createdAt),
  };
}

export async function getUserOrders(userId: string): Promise<OrderType[]> {
  await connectDB();
  const docs = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
  return docs.map((d) => toPlain(d as Record<string, unknown>));
}

export async function getOrderById(id: string, userId: string): Promise<OrderType | null> {
  await connectDB();
  // Scope by user so people can only read their own orders.
  const doc = await Order.findOne({ _id: id, user: userId }).lean();
  return doc ? toPlain(doc as Record<string, unknown>) : null;
}

// Admin: every order.
export async function getAllOrders(): Promise<(OrderType & { email?: string })[]> {
  await connectDB();
  const docs = await Order.find().sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({ ...toPlain(d as Record<string, unknown>), email: (d as { email?: string }).email }));
}
