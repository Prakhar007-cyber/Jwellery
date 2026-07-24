import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { SHIPPING_FLAT, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

/*
  POST /api/checkout — create an order.
  ------------------------------------------------------------
  SECURITY: we never trust prices from the client. We take only
  the product id, size and quantity, then look up the REAL price
  in MongoDB and compute the authoritative total on the server.

  Payment is abstracted: this demo marks orders as paid via a mock
  flow. To add Stripe/Razorpay later, create a payment intent here
  before creating the order (see processPayment()).
*/

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        size: z.string().optional(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1),
  shippingAddress: z.object({
    name: z.string().min(1),
    phone: z.string().min(3),
    line1: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
  email: z.string().email(),
});

// Human-friendly order reference, e.g. ELN-8F3K2A.
function makeReference() {
  const s = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ELN-${s}`;
}

// Payment abstraction — swap this for Stripe/Razorpay later.
async function processPayment(): Promise<{ status: "paid" | "pending" }> {
  return { status: "paid" }; // mock success in development
}

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid checkout details." }, { status: 400 });
    }
    const { items, shippingAddress, email } = parsed.data;

    await connectDB();

    // Look up real products and build authoritative order lines.
    const ids = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: ids } }).lean();
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    let subtotal = 0;
    for (const line of items) {
      const product = byId.get(line.productId);
      if (!product) {
        return NextResponse.json({ error: "A product in your bag is no longer available." }, { status: 400 });
      }
      const price = product.price; // authoritative price from DB
      subtotal += price * line.quantity;
      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.images?.[0],
        price,
        size: line.size,
        quantity: line.quantity,
      });
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    const total = subtotal + shipping;

    const payment = await processPayment();

    const session = await auth();
    const order = await Order.create({
      user: session?.user?.id,
      email,
      reference: makeReference(),
      items: orderItems,
      shippingAddress,
      subtotal,
      shipping,
      total,
      paymentStatus: payment.status,
      orderStatus: "Processing",
    });

    return NextResponse.json({ reference: order.reference, total }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not place your order." }, { status: 500 });
  }
}
