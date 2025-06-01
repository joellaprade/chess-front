"use client";
import { useWsContext } from "../../context/WsContext";
import { useGameContext } from "../../context/GameContext";
import { useAuth } from "@/reusable/context/AuthContext";

const useGame = () => {
  const { gameId } = useGameContext();
  const { setOMsg } = useWsContext();

  // MESSAGES
  const sendMove = (origin: number, destination: number) => {
    console.log("e");
    setOMsg({
      action: "move",
      payload: { gameId, origin, destination },
    });
  };

  return { sendMove };
};

export default useGame;
