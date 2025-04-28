import { cookies } from "next/headers";
import { Session } from "../models/Session";
import { User } from "../models/User";
import crypto from "crypto";
import { Player } from "../models/Player";

export const createSession = async ({
  name,
  email,
  _id: userId,
}: User): Promise<Session | null> => {
  const cookieStore = await cookies();
  const sessionToken = crypto.randomBytes(8).toString("hex");
  const player = await Player.findOne({ userId: userId.toString() });
  const playerId = player._id;

  const session = await Session.create({
    sessionToken,
    userId,
    playerId,
    user: {
      name,
      email,
    },
  });

  cookieStore.set("sessionToken", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  cookieStore.set("userId", userId.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return session;
};
