"use client";
import useWs from "../../hooks/useWs";
import { useGameContext } from "../../context/GameContext";
import { useWsContext } from "@/reusable/context/WsContext";
import { useEffect } from "react";
import { Instruction } from "@/reusable/types/instruction";
import { useCheckMove } from "./useCheckMove";
import { useBoardUtils } from "./useBoardUtils";
import useBoard from "./useBoard";

const useGameWs = () => {
  const { gameId } = useGameContext();
  const { sendMsg } = useWs();
  const { handleFunctionsPool } = useWsContext();
  const { handleMove } = useBoard();
  const { calculateLegalMoves, validateMove } = useCheckMove();
  const { getSquareById } = useBoardUtils();

  const sendMove = (origin: number, destination: number) => {
    sendMsg({
      route: "game",
      action: "move",
      payload: { gameId: gameId.current, origin, destination },
    });
  };

  const handleOppMove = ({ origin, destination }: { origin: number; destination: number }) => {
    const movingPiece = getSquareById(origin).piece;
    const moves = calculateLegalMoves(origin);
    const isValid = validateMove(origin, destination);
    if (isValid) {
      handleMove(movingPiece, destination);
    }
  };
  const handleMessage = (instruction: Instruction) => {
    switch (instruction.action) {
      case "move":
        handleOppMove(instruction.payload);
        break;
    }
  };
  useEffect(() => {
    handleFunctionsPool.current.set("game", handleMessage);
  }, []);

  return { sendMove };
};

export default useGameWs;
