"use client";
import { useWsContext } from "../../context/WsContext";
import { useGameContext } from "../../context/GameContext";

const useGame = () => {
  const { gameId } = useGameContext();
  const { setOMsg } = useWsContext();

  const sendMove = (origin: number, destination: number) => {
    setOMsg({
      action: "move",
      payload: { gameId, origin, destination },
    });
  };

  return { sendMove };
};

export default useGame;
