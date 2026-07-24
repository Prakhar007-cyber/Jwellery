import { connectDB } from "./db";
import { Product } from "./models/Product";
import type { Product as ProductType, Category } from "./types";

/*
  Server-side data helpers.
  ------------------------------------------------------------
  Plain functions that connect to MongoDB and return JSON-safe
  product objects. Used by Server Components (landing page, shop,
  product detail). No abstraction layers — just Mongoose queries.
*/

// Convert a Mongoose document to a plain, serializable Product.
// (Server Components can only pass plain objects to Client Components.)
function toPlain(doc: Record<string, unknown>): ProductType {
  return {
    _id: String(doc._id),
    name: doc.name as string,
    slug: doc.slug as string,
    description: doc.description as string,
    shortDescription: (doc.shortDescription as string) || "",
    price: doc.price as number,
    compareAtPrice: doc.compareAtPrice as number | undefined,
    category: doc.category as Category,
    collection: doc.collection as ProductType["collection"],
    material: (doc.material as string) || "",
    stone: (doc.stone as string) || "",
    images: (doc.images as string[]) || [],
    sizes: (doc.sizes as string[]) || [],
    stock: (doc.stock as number) ?? 0,
    featured: Boolean(doc.featured),
    newArrival: Boolean(doc.newArrival),
    bestSeller: Boolean(doc.bestSeller),
    createdAt: doc.createdAt ? String(doc.createdAt) : undefined,
  };
}

export interface ProductQuery {
  category?: string;
  collection?: string;
  material?: string;
  inStock?: boolean;
  sort?: "featured" | "newest" | "price-asc" | "price-desc";
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Main shop query with filters + sorting.
export async function getProducts(q: ProductQuery = {}): Promise<ProductType[]> {
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (q.category) filter.category = q.category;
  if (q.collection) filter.collection = q.collection;
  if (q.material) filter.material = q.material;
  if (q.inStock) filter.stock = { $gt: 0 };
  if (q.search) filter.$text = { $search: q.search };
  if (q.minPrice != null || q.maxPrice != null) {
    filter.price = {};
    if (q.minPrice != null) (filter.price as Record<string, number>).$gte = q.minPrice;
    if (q.maxPrice != null) (filter.price as Record<string, number>).$lte = q.maxPrice;
  }

  let sort: Record<string, 1 | -1> = { featured: -1, createdAt: -1 };
  if (q.sort === "newest") sort = { createdAt: -1 };
  else if (q.sort === "price-asc") sort = { price: 1 };
  else if (q.sort === "price-desc") sort = { price: -1 };

  const docs = await Product.find(filter).sort(sort).lean();
  return docs.map(toPlain);
}

export async function getFeaturedProducts(limit = 6): Promise<ProductType[]> {
  await connectDB();
  const docs = await Product.find({ featured: true }).limit(limit).lean();
  return docs.map(toPlain);
}

export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  await connectDB();
  const doc = await Product.findOne({ slug }).lean();
  return doc ? toPlain(doc as Record<string, unknown>) : null;
}

export async function getProductById(id: string): Promise<ProductType | null> {
  await connectDB();
  const doc = await Product.findById(id).lean();
  return doc ? toPlain(doc as Record<string, unknown>) : null;
}

// "You may also love" — same category, excluding the current product.
export async function getRelatedProducts(
  category: string,
  excludeSlug: string,
  limit = 4
): Promise<ProductType[]> {
  await connectDB();
  const docs = await Product.find({ category, slug: { $ne: excludeSlug } })
    .limit(limit)
    .lean();
  return docs.map(toPlain);
}

export async function searchProducts(term: string, limit = 8): Promise<ProductType[]> {
  await connectDB();
  if (!term.trim()) return [];
  // Try a text search, fall back to a case-insensitive name regex.
  const regex = new RegExp(term.trim(), "i");
  const docs = await Product.find({
    $or: [{ name: regex }, { material: regex }, { stone: regex }, { category: regex }],
  })
    .limit(limit)
    .lean();
  return docs.map(toPlain);
}

// Fetch several products by id — used to validate the cart at checkout.
export async function getProductsByIds(ids: string[]): Promise<ProductType[]> {
  await connectDB();
  const docs = await Product.find({ _id: { $in: ids } }).lean();
  return docs.map(toPlain);
}
