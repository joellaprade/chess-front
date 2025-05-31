"use client";
import Board from "@/reusable/components/game/Board";
import User from "@/reusable/components/game/User";
import { useGameContext } from "@/reusable/context/GameContext";

const Game = () => {
  const { playersData, isThisPlayerWhite } = useGameContext();

  const thisPlayer = playersData.current[isThisPlayerWhite.current ? 0 : 1];
  const oponent = playersData.current[isThisPlayerWhite.current ? 1 : 0];

  return (
    <div className="game">
      <User user={oponent} />
      <Board isWhite={isThisPlayerWhite.current} />
      <User user={thisPlayer} />
    </div>
  );
};

export default Game;
