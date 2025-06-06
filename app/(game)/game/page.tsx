"use client";
import Board from "@/reusable/components/game/Board";
import User from "@/reusable/components/game/User";
import { useGameContext } from "@/reusable/context/GameContext";
import useResetGameBoard from "@/reusable/hooks/resetGameBoard";
import useWs from "@/reusable/hooks/useWs";
import { useEffect } from "react";

const Game = () => {
  useWs();
  const { playersData, isThisPlayerWhite } = useGameContext();
  const { resetBoard } = useResetGameBoard();

  const thisPlayer = playersData.current[isThisPlayerWhite.current ? 0 : 1];
  const oponent = playersData.current[isThisPlayerWhite.current ? 1 : 0];

  useEffect(() => resetBoard, []);

  return (
    <div className="game">
      <User user={oponent} />
      <Board isWhite={isThisPlayerWhite.current} />
      <User user={thisPlayer} />
    </div>
  );
};

export default Game;
