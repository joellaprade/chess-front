"use client";

import { useWs } from "@/reusable/context/WsContext";
import { Player } from "@/reusable/models/Player";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  player: Player | string;
  func?: (username: string) => void;
};

const Friend = ({ player, func }: Props) => {
  const parsedPlayer =
    typeof player == "string" ? (JSON.parse(player) as Player) : player;
  const { username, image, isOnline: initialIsOnline } = parsedPlayer;
  const { iMsg } = useWs();
  const [isOnline, setIsOnline] = useState(initialIsOnline);

  useEffect(() => {
    console.log(iMsg?.payload.username, username);
    if (iMsg?.payload.username != username) {
      console.log(" ran 0");
      return;
    }
    if (iMsg?.action === "notify-only-is-online") {
      console.log("ran 1");
      setIsOnline(true);
    } else if (iMsg?.action === "notify-only-is-not-online") {
      console.log("ran 2");
      setIsOnline(false);
    }
    console.log(iMsg?.action);
  }, [iMsg]);

  useEffect(() => {
    console.log(isOnline);
  }, [isOnline]);

  useEffect(() => setIsOnline(initialIsOnline), [player]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`${isOnline ? "" : "hidden"} online-icon`}></div>
          <Image
            className="profile-picture"
            width={60}
            height={60}
            alt="profile-picture"
            src={image || "/assets/profile-picture.svg"}
          />
        </div>
        <h3>{username}</h3>
      </div>
      <button onClick={() => func?.(username)} className="small-btn bg-green">
        <Image
          src={"/assets/pawn-icon.png"}
          alt="small pawn"
          width={20}
          height={20}
          className="object-contains"
        />
      </button>
    </div>
  );
};

export default Friend;
