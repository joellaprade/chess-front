"use server";
import { User } from "@/reusable/models/User";
import bcrypt from "bcrypt";
import db from "../lib/db";
import { getFormValues } from "../lib/utils";
import { Player } from "../models/Player";
import { handleMailVerification } from "./handleMailVerification";

type formData = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export async function signup(formData: FormData): Promise<boolean> {
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

    await Player.create({ username, userId: user._id });
    await handleMailVerification(email, user._id.toString());

    return true;
  } catch (e) {
    throw new Error("Ocurrió un error al crear un nuevo usuario.");
  }
}

// korina: https://res.cloudinary.com/dd86ogsbh/image/upload/v1746031289/iow5fmupmk4x2adtq4ki.jpg
// horse: https://res.cloudinary.com/dd86ogsbh/image/upload/v1746031251/goxyjdvfysurhlfveetv.jpg
// placeholder: https://res.cloudinary.com/dd86ogsbh/image/upload/v1746553576/fnm2du6brktixowpusgd.svg
