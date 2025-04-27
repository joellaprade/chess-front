import { cookies } from "next/headers";
import { Session } from "../models/Session";
import { User } from "../models/User";
import crypto from "crypto";

export const createSession = async ({
  name,
  email,
  _id: userId,
}: User): Promise<Session | null> => {
  const cookieStore = await cookies();
  const sessionToken = crypto.randomBytes(8).toString("hex");
  const playerId = User.findOne({ userId });

  const session = await Session.create({
    sessionToken,
    userId,
    playerId,
    user: {
      name,
      email,
    },
  });

  cookieStore.set("sessionToken", JSON.stringify(sessionToken), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  cookieStore.set("userId", JSON.stringify(userId), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return session;
};
