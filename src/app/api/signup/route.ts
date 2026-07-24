import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

/*
  POST /api/signup — create a new customer account.
  1. validate input, 2. check email isn't taken,
  3. hash the password, 4. create the user.
  Passwords are never stored in plain text.
*/

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check your details." }, { status: 400 });
    }
    const { firstName, lastName, email, password } = parsed.data;

    await connectDB();
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      name: `${firstName} ${lastName}`.trim(),
      email: email.toLowerCase(),
      passwordHash,
      role: "customer",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
