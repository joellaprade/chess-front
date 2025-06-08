"use client";

import useGameWs from "@/reusable/hooks/game/useGameWs";
import useHomePage from "@/reusable/hooks/useHomePage";
import { Player } from "@/reusable/models/Player";
import { X } from "lucide-react";
import Image from "next/image";
type Props = {
  player: Player;
};

const Friend = ({ player }: Props) => {
  const { username, image, isOnline, _id } = player;
  const { removeFriend } = useHomePage();
  const { requestGameToFriend } = useGameWs();

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
      <div className="flex gap-5">
        <button onClick={() => requestGameToFriend(_id.toString())} className="small-btn bg-green">
          <Image
            src={"/assets/pawn-icon.png"}
            alt="small pawn"
            width={20}
            height={20}
            className="object-contains"
          />
        </button>
        <button onClick={() => removeFriend(username)} className="small-btn bg-red-400">
          <X className="h-[20px] w-[20px]" />
        </button>
      </div>
    </div>
  );
};

export default Friend;
