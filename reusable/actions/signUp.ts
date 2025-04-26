"use server";
import { User } from "@/reusable/models/User";
import bcrypt from "bcrypt";
import db from "../lib/db";
import { getFormValues } from "../lib/utils";
import { Player } from "../models/Player";

type formData = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export async function signUp(formData: FormData): Promise<void> {
  try {
    await db();
    const { username, password, name, email } =
      getFormValues<formData>(formData);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    const player: Player = await Player.create({ userId: user._id });
  } catch (e) {
    console.error(e);
  }
}
