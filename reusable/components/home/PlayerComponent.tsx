"use client";

import { Player } from "@/reusable/models/Player";
import Image from "next/image";

type Props = {
  player: Player | string;
  func?: (username: string) => void;
};

const PlayerComponent = ({ player, func }: Props) => {
  const parsedPlayer =
    typeof player == "string" ? (JSON.parse(player) as Player) : player;
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

export default PlayerComponent;
