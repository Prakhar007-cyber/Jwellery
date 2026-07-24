import mongoose, { Schema, model, models } from "mongoose";

/*
  Order model — created at checkout. Totals are always calculated
  on the server from real product prices, never trusted from the
  client (see /api/checkout).
*/

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    price: Number, // authoritative price captured at purchase time
    size: String,
    quantity: Number,
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    name: String,
    phone: String,
    line1: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    reference: { type: String, required: true, unique: true }, // e.g. ELN-8F3K2A
    email: String,
    items: { type: [orderItemSchema], default: [] },
    shippingAddress: shippingAddressSchema,
    subtotal: Number,
    shipping: Number,
    total: Number,
    paymentStatus: { type: String, enum: ["paid", "pending"], default: "paid" },
    orderStatus: {
      type: String,
      enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", orderSchema);
export type OrderDoc = mongoose.InferSchemaType<typeof orderSchema>;
