"use server";

import db from "../lib/db";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { Player } from "../models/Player";
import { getFormValues } from "../lib/utils";

type formData = {
  name: string;
  email: string;
  username: string;
  password: string;
};

// export async function signUp(formData: FormData) {
export async function signUp(body: any) {
  try {
    await db();
    console.log(body, body.name, typeof body.name);
    // const { name, email, username, password } =
    //   getFormValues<formData>(formData);

    const { name } = body;

    // const hashedPassword = await bcrypt.hash(password as string, 10);

    const user = await User.create(body);

    const player: Player = await Player.create({ userId: user._id });

    console.log(player);
  } catch (e: any) {
    console.error("Validation error:", JSON.stringify(e.errors, null, 2));
  }
}
