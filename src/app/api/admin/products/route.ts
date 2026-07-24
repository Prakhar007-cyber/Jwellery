import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminGuard";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";

/*
  Admin products collection API.
  GET  — list all products (admin table)
  POST — create a product
  Both require an admin session (checked server-side).
*/

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().optional().default(""),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  category: z.enum(["rings", "necklaces", "bracelets", "earrings", "wedding"]),
  collection: z.enum(["celeste", "eternal", "solstice", "aurora"]).default("celeste"),
  material: z.string().optional().default(""),
  stone: z.string().optional().default(""),
  images: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  stock: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
});

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products: products.map((p) => ({ ...p, _id: String(p._id) })) });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = productSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product data." }, { status: 400 });
  }

  await connectDB();
  const created = await Product.create({ ...parsed.data, slug: slugify(parsed.data.name) });
  return NextResponse.json({ id: String(created._id) }, { status: 201 });
}
