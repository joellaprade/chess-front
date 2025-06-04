"use client";

import { Player } from "@/reusable/models/Player";
import { Check, X } from "lucide-react";
import Image from "next/image";

type Props = {
  player: Record<string, any> | string;
  acceptFunc: () => void;
  denyFunc?: () => void;
};

const PlayerComponent = ({ player, acceptFunc, denyFunc }: Props) => {
  const parsedPlayer = typeof player == "string" ? (JSON.parse(player) as Player) : player;
  const { username, image } = parsedPlayer;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          className="profile-picture"
          width={60}
          height={60}
          alt="profile-picture"
          src={image || "/assets/profile-picture.svg"}
        />
        <h3>{username}</h3>
      </div>
      <div className="flex gap-5">
        <button onClick={acceptFunc} className="small-btn bg-green">
          <Check className="h-5 w-5" />
        </button>
        <button
          onClick={denyFunc}
          className={`${denyFunc !== undefined ? "" : "hidden"} small-btn bg-red-400`}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PlayerComponent;
