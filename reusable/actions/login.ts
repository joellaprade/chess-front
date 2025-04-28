"use server";

import db from "../lib/db";
import { getFormValues } from "../lib/utils";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { createSession } from "@/reusable/lib/auth";
import { redirect } from "next/navigation";

type formValues = {
  username: string;
  password: string;
};

export default async function login(formData: FormData): Promise<void> {
  await db();

  const { username, password } = getFormValues<formValues>(formData);

  const user: User | null = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    await createSession(user);
    redirect("/home");
  } else {
    throw new Error("El usuario o contraseña son incorrectos.");
  }
}
