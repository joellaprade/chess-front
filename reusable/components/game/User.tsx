import Timer from "./Timer";
import ProfilePlaceholder from "../home/ProfilePlaceholder";
import { PlayerData } from "@/reusable/types/PlayerData";
import Image from "next/image";

const User = ({ user }: { user: PlayerData }) => {
  return (
    user && (
      <div className="user">
        <div className="flex items-center gap-5">
          {user?.image ? (
            <Image
              className="rounded-full"
              src={user?.image}
              width={70}
              height={70}
              alt="user-img"
            />
          ) : (
            <ProfilePlaceholder />
          )}
          <h3>{user.username}</h3>
        </div>
        <Timer isWhite={user.isWhite} />
      </div>
    )
  );
};

export default User;
