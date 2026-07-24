import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { getProductsByIds } from "@/lib/data";

/*
  Wishlist API for signed-in users. Stores product ids on the User
  document. All routes require a session.
  GET    — return the user's saved products
  POST   — add a product id
  DELETE — remove a product id
*/

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ items: [] });

  await connectDB();
  const user = await User.findById(session.user.id).lean<{ wishlist?: unknown[] }>();
  const ids = (user?.wishlist || []).map(String);
  const items = await getProductsByIds(ids);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  await connectDB();
  // $addToSet avoids duplicates.
  await User.findByIdAndUpdate(session.user.id, { $addToSet: { wishlist: productId } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  await connectDB();
  await User.findByIdAndUpdate(session.user.id, { $pull: { wishlist: productId } });
  return NextResponse.json({ ok: true });
}
