"use client";

import { Player } from "@/reusable/models/Player";
import PlayerComponent from "./PlayerComponent";
import useWs from "@/reusable/hooks/useWs";

type Props = {
  reqs: Player[];
};

const FriendReqList = ({ reqs }: Props) => {
  const { sendAddRequest } = useWs();

  return (
    <div className="friend-list">
      {reqs.map((req, i) => (
        <PlayerComponent
          key={i}
          player={req}
          func={() => sendAddRequest(req.username)}
        />
      ))}
    </div>
  );
};

export default FriendReqList;
