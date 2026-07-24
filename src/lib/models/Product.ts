import mongoose, { Schema, model, models } from "mongoose";

/*
  Product model — defines how a jewelry piece is stored in MongoDB.
  Straightforward Mongoose schema, no extra abstraction layers.
*/

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    category: {
      type: String,
      required: true,
      enum: ["rings", "necklaces", "bracelets", "earrings", "wedding"],
      index: true,
    },
    collection: {
      type: String,
      enum: ["celeste", "eternal", "solstice", "aurora"],
      default: "celeste",
    },
    material: { type: String, default: "" },
    stone: { type: String, default: "" },
    images: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
  },
  // `collection` is a reserved Mongoose key; we knowingly use it as a field.
  { timestamps: true, suppressReservedKeysWarning: true }
);

// Text index powers the search overlay.
productSchema.index({ name: "text", description: "text", material: "text", stone: "text" });

export const Product = models.Product || model("Product", productSchema);
export type ProductDoc = mongoose.InferSchemaType<typeof productSchema>;
