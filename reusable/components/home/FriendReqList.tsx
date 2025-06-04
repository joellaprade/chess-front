"use client";

import { Player } from "@/reusable/models/Player";
import PlayerComponent from "./PlayerComponent";
import useHomePage from "@/reusable/hooks/useHomePage";

type Props = {
  reqs: Player[];
};

const FriendReqList = ({ reqs }: Props) => {
  const { sendAddRequest, denyFriendRequest } = useHomePage();

  return (
    <div className="friend-list">
      {reqs.map((req, i) => (
        <PlayerComponent
          key={i}
          player={req}
          acceptFunc={() => sendAddRequest(req.username)}
          denyFunc={() => denyFriendRequest(req.username)}
        />
      ))}
    </div>
  );
};

export default FriendReqList;
