"use client";
import useWs from "../../hooks/useWs";
import { useGameContext } from "../../context/GameContext";
import { useWsContext } from "@/reusable/context/WsContext";
import { useEffect, useState } from "react";
import { Instruction } from "@/reusable/types/instruction";

const useGameWs = () => {
  const { gameId } = useGameContext();
  const { sendMsg } = useWs();
  const { handleFunctionsPool } = useWsContext();
  const [incommingMove, setIncommingMove] = useState<Instruction | null>(null);

  const sendMove = (origin: number, destination: number) => {
    sendMsg({
      route: "game",
      action: "move",
      payload: { gameId: gameId.current, origin, destination },
    });
  };

  const handleMessage = (instruction: Instruction) => {
    switch (instruction.action) {
      case "move":
        setIncommingMove(instruction.payload);
        break;
    }
  };
  useEffect(() => {
    handleFunctionsPool.current.set("game", handleMessage);
  }, []);

  return { incommingMove, sendMove };
};

export default useGameWs;

// usar useState con incomming move pq se requiere un render update
