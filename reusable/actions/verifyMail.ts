"use server";

import { cookies } from "next/headers";
import { VerificationCode } from "../models/VerificationCode";
import { User } from "../models/User";
import { createSession } from "../lib/auth";
import { getFormValues } from "../lib/utils";

type formData = {
  code: string;
};

export const verifyMail = async (formData: FormData) => {
  const { code } = getFormValues<formData>(formData);
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  const verificationCode = await VerificationCode.findOne({ userId });
  if (verificationCode === null || verificationCode.code !== code) return false;

  const user: User | null = await User.findById(userId);
  if (user === null) return false;

  user.active = true;
  await user.save();
  await createSession(user);

  return true;
};
