import { cookies } from "next/headers";
import { Session } from "../models/Session";
import { User } from "../models/User";
import crypto from "crypto";
import { Player } from "../models/Player";
import { cache } from "react";
import db from "./db";
import mongoose from "mongoose";

export const createSession = async ({
  name,
  username,
  email,
  image,
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
      username,
      email,
      image,
    },
  });

  cookieStore.set("sessionToken", sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  cookieStore.set("userId", userId.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return session;
};

export const getSession = cache(async (): Promise<Session | null> => {
  try {
    await db();
    const cookieStore = await cookies();
    let sessionToken = cookieStore.get("sessionToken")?.value;

    if (sessionToken) {
      const session = await Session.findOne({ sessionToken });
      return session;
    } else return null;
  } catch (e) {
    console.error(e);
    return null;
  }
});

export const getPlayer = cache(async (): Promise<Player | null> => {
  try {
    await db();
    const cookieStore = await cookies();
    let userId = cookieStore.get("userId")?.value;

    if (userId) {
      const player: any = await Player.findOne({ userId })
        .populate([
          { path: "friends", select: "username image isOnline" },
          { path: "friendReqs", select: "username image" },
          { path: "gameReqs.sender", select: "username image" },
        ])
        .lean<Player | null>();
        if (!player) return null;
        player.gameReqs = player.gameReqs.map((req: any) => ({...req.sender, gameId: req.gameId,}))
      return player;
    } else return null;
  } catch (e) {
    console.error(e);
    return null;
  }
});
