"use client";

import { Player } from "@/reusable/models/Player";
import PlayerComponent from "./PlayerComponent";
import { useWs } from "@/reusable/context/WsContext";

type Props = {
  reqs: Player[];
};

const FriendReqList = ({ reqs }: Props) => {
  const { setOMsg } = useWs();
  const sendAddRequest = (username: string) => {
    setOMsg({
      action: "add-friend",
      payload: { username },
    });
  };
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
