import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminGuard";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";

// PUT /api/admin/orders/[id] — update an order's status (admin only).
const schema = z.object({
  orderStatus: z.enum(["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"]),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const { id } = await params;
  await connectDB();
  await Order.findByIdAndUpdate(id, { orderStatus: parsed.data.orderStatus });
  return NextResponse.json({ ok: true });
}
