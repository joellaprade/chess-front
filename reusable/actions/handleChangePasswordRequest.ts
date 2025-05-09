"use server";

import { cookies } from "next/headers";
import { getFormValues } from "../lib/utils";
import { User } from "../models/User";
import { VerificationCode } from "../models/VerificationCode";
import { redirect } from "next/navigation";
import { sendMail } from "./sendMail";

type formFields = {
  email: string;
};

export const handleChangePasswordRequest = async (formData: FormData) => {
  const { email } = getFormValues<formFields>(formData);
  const user = await User.findOne({ email });
  const userId = user._id.toString();
  const code = Math.floor(100000 + Math.random() * 900000);
  const cookieStore = await cookies();

  const subject = "Cambiar Contraseña";
  const text = `Tu codigo de verificación es: ${code}`;
  await sendMail(email, subject, text);

  await VerificationCode.findOneAndDelete({ userId });
  await VerificationCode.create({ userId, code });
  cookieStore.set("userId", userId);

  redirect("/change-password");
};
