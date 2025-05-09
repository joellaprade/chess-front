"use server";

import { cookies } from "next/headers";
import { getFormValues } from "../lib/utils";
import { VerificationCode } from "../models/VerificationCode";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

type formValues = {
  password: string;
  code: string;
};

export const changePassword = async (formData: FormData) => {
  const { password, code } = getFormValues<formValues>(formData);
  const userId = (await cookies()).get("userId")?.value;
  const [user, verificationCode]: [User | null, VerificationCode | null] =
    await Promise.all([
      User.findById(userId),
      VerificationCode.findOne({ userId }),
    ]);

  if (!user || !verificationCode || verificationCode.code !== code)
    return false;

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  redirect("/login");
};
