import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";

/*
  Admin single-product API.
  PUT    — update a product
  DELETE — delete a product
  Both require an admin session.
*/

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const data = await req.json();
  await connectDB();
  const updated = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await connectDB();
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
