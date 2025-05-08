"use server";

import { VerificationCode } from "../models/VerificationCode";
import db from "../lib/db";
import { cookies } from "next/headers";
import { sendVerificationMail } from "./sendVerificationMail";

export const handleMailVerification = async (email: string, userId: string) => {
  try {
    const cookieStore = await cookies();
    const code = Math.floor(Math.random() * 1000000);

    cookieStore.set("userId", userId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    await db();
    await VerificationCode.create({ userId, code });
    await sendVerificationMail(email, code);
  } catch (e) {
    console.error(e);
  }
};
