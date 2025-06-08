"use client";

import useGameWs from "@/reusable/hooks/game/useGameWs";
import PlayerComponent from "./PlayerComponent";

type Props = {
  reqs: Record<string, any>[];
};

const GameReqList = ({ reqs }: Props) => {
  const { acceptGame, denyGameRequest } = useGameWs();

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
