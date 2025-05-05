"use server";

import db from "../lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Session } from "../models/Session";

export default async function logout(): Promise<void> {
  await db();

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  const session = await Session.findOneAndDelete({ sessionToken });

  cookieStore.set("sessionToken", "", { maxAge: 0, path: "/" });
  cookieStore.set("userId", "", { maxAge: 0, path: "/" });

  if (session) {
    redirect("/");
  } else {
    throw new Error("No se pudo encontrar la session.");
  }
}
