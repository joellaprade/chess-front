"use server";

import { VerificationCode } from "../models/VerificationCode";
import db from "../lib/db";
import { cookies } from "next/headers";
import { sendMail } from "./sendMail";

export const handleMailVerification = async (email: string, userId: string) => {
  try {
    const cookieStore = await cookies();
    const code = Math.floor(100000 + Math.random() * 900000);
    cookieStore.set("userId", userId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    const subject = "Verifica tu Correo";
    const text = `Tu codigo de verificación es: ${code}`;
    await sendMail(email, subject, text);
    await db();
    await VerificationCode.create({ userId, code });
  } catch (e) {
    console.error(e);
  }
};
