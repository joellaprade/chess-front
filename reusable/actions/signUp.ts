"use server";
import { User } from "@/reusable/models/User";
import bcrypt from "bcrypt";
import db from "../lib/db";
import { getFormValues } from "../lib/utils";
import { Player } from "../models/Player";
import { createSession } from "../lib/auth";
import { redirect } from "next/navigation";

type formData = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export async function signup(formData: FormData): Promise<void> {
  await db();
  const { username, password, name, email } = getFormValues<formData>(formData);
  const hashedPassword = await bcrypt.hash(password, 10);

  const user: User = await User.create({
    name,
    email,
    username,
    password: hashedPassword,
  });

  const player: Player = await Player.create({ userId: user._id });
  if (player) {
    await createSession(user);
    redirect("/home");
  } else {
    throw new Error("Ocurrió un error al crear un nuevo usuario.");
  }
}
