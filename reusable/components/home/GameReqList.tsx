"use client";

import PlayerComponent from "./PlayerComponent";
import useHomePage from "@/reusable/hooks/useHomePage";

type Props = {
  reqs: Record<string, any>[];
};

const GameReqList = ({ reqs }: Props) => {
  const { acceptGame, denyGameRequest } = useHomePage();

  return (
    <div className="friend-list">
      {reqs.map((sender, i) => (
        <PlayerComponent
          key={i}
          player={sender}
          acceptFunc={() => acceptGame(sender.gameId)}
          denyFunc={() => denyGameRequest(sender.gameId)}
        />
      ))}
    </div>
  );
};

export default GameReqList;
