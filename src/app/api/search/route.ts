import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/data";

// GET /api/search?q=... — live product search for the search overlay.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const products = await searchProducts(q, 8);
  return NextResponse.json({ products });
}
