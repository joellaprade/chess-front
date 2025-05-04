import Friend from "@/reusable/components/home/Friend";
import { getPlayer } from "@/reusable/lib/auth";
import { Player } from "@/reusable/models/Player";
import { Mail } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const player = await getPlayer();
  const friends = player?.friends as unknown as Player[];
  const hasInvitations =
    player?.gameReqs?.length > 0 || player?.friendReqs?.length > 0;

  return (
    <>
      <Link href={"/friends/invitations"} className="absolute top-0 right-10">
        <Mail className="h-8 w-8 text-white" />
        <div
          className={`${hasInvitations ? "" : "hidden"} absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-300`}
        ></div>
      </Link>
      <div className="friend-list">
        {friends &&
          friends.map((friend, i) => (
            <Friend key={i} username={friend?.username} image={friend?.image} />
          ))}
      </div>
      <Link className="w-full" href={"/friends/add"}>
        <button className="big-btn secondary-btn">Agregar Amigo</button>
      </Link>
    </>
  );
}
