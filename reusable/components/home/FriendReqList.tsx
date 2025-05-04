"use client";

import { Player } from "@/reusable/models/Player";
import Friend from "./Friend";
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
        <Friend
          key={i}
          username={req.username}
          image={req.image}
          func={() => sendAddRequest(req.username)}
        />
      ))}
    </div>
  );
};

export default FriendReqList;
