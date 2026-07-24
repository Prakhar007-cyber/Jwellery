import mongoose, { Schema, model, models } from "mongoose";

/*
  User model.
  ------------------------------------------------------------
  Stores account info. Passwords are never stored in plain text —
  we save a bcrypt hash in `passwordHash`. Google users may have
  no password at all. `role` drives admin authorization.
*/

const addressSchema = new Schema(
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

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String }, // absent for OAuth-only accounts
    image: { type: String },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    addresses: { type: [addressSchema], default: [] },
    // Wishlist is stored as an array of product ids for signed-in users.
    wishlist: { type: [Schema.Types.ObjectId], ref: "Product", default: [] },
  },
  { timestamps: true }
);

export const User = models.User || model("User", userSchema);
export type UserDoc = mongoose.InferSchemaType<typeof userSchema>;
