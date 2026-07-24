/*
  Shared, simple TypeScript types used across the app.
  These mirror the Mongoose schemas but are plain objects
  (what the client actually receives after JSON serialization).
*/

export type Category =
  | "rings"
  | "necklaces"
  | "bracelets"
  | "earrings"
  | "wedding";

export type Collection = "celeste" | "eternal" | "solstice" | "aurora";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  collection: Collection;
  material: string;
  stone: string;
  images: string[];
  sizes: string[];
  stock: number;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// A single line in the cart. We keep a snapshot of a few product
// fields so the cart drawer can render without extra fetches.
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  quantity: number;
}

export type OrderStatus =
  | "Processing"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  _id: string;
  reference: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: "paid" | "pending";
  orderStatus: OrderStatus;
  createdAt: string;
}
