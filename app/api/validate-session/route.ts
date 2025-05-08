import { Session } from "@/reusable/models/Session";
import { NextResponse } from "next/server";
import db from "@/reusable/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  await db();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;
  const session = await Session.findOne({ sessionToken });

  return NextResponse.json({ isValidSession: !!session });
}
