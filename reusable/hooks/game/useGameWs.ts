"use client";
import useWs from "../../hooks/useWs";
import { useGameContext } from "../../context/GameContext";
import { useWsContext } from "@/reusable/context/WsContext";
import { useEffect, useState } from "react";
import { Instruction } from "@/reusable/types/instruction";
import { useHomePageContext } from "@/reusable/context/HomePageContext";
import { useRouter } from "next/navigation";
import useResetGameBoard from "@/reusable/hooks/resetGameBoard";

const useGameWs = () => {
  const { reset } = useResetGameBoard();
  const router = useRouter();
  const { sendMsg } = useWs();
  const { handleFunctionsPool } = useWsContext();
  const { notificationHandler, setGameReqs } = useHomePageContext();
  const {
    playersData,
    isThisPlayerWhite,
    gameId,
    isSearchingForGame,
    setIncommingMove,
    setIsDraw,
    setIsWin,
  } = useGameContext();

  // Handlers
  const handleStartGame = (payload: any[]) => {
    reset();
    const [p1, p2, gameId_, isWhite] = payload;
    playersData.current = [p1, p2];
    isThisPlayerWhite.current = isWhite;
    gameId.current = gameId_;

    localStorage.setItem("playerData", JSON.stringify([p1, p2]));
    localStorage.setItem("isThisPlayerWhite", JSON.stringify(isWhite));
    localStorage.setItem("gameId", JSON.stringify(gameId_));
    localStorage.setItem("isWhiteTurn", JSON.stringify(true));

    router.push("/game");
  };
  const handleMessage = (instruction: Instruction) => {
    switch (instruction.action) {
      case "move":
        setIncommingMove(instruction as Instruction);
        break;
      case "draw-game":
        setIsDraw(true);
        break;
      case "notify-player-left":
        isSearchingForGame.current = false;
        break;
      case "notify-game-request":
        setGameReqs((prevState) => [...prevState, instruction.payload]);
        break;
      case "start-game":
        handleStartGame(instruction.payload);
        break;
      case "resign":
        setIsWin(instruction.payload);
    }
    notificationHandler.current!(instruction);
  };

  // MESSAGES
  const sendMove = (origin: number, destination: number) => {
    sendMsg({
      route: "game",
      action: "move",
      payload: { gameId: gameId.current, origin, destination },
    });
  };
  const drawRequest = () => {
    sendMsg({
      route: "game",
      action: "draw-request",
      payload: { e: "e" },
    });
  };
  const resign = () => {
    sendMsg({
      route: "game",
      action: "resign",
      payload: { e: "e" },
    });
  };
  const denyGameRequest = (gameId: string) => {
    setGameReqs((prevState) => prevState.filter((req) => req.gameId !== gameId));
    sendMsg({
      route: "game",
      action: "game-denied",
      payload: { gameId },
    });
  };
  const requestRandomGame = () => {
    sendMsg({
      route: "game",
      action: "random-game-request",
      payload: { e: null },
    });
  };
  const cancelRandomGame = () => {
    sendMsg({
      route: "game",
      action: "random-game-cancel",
      payload: { e: null },
    });
  };
  const requestGameToFriend = (playerId: string) => {
    sendMsg({
      route: "game",
      action: "game-request",
      payload: { playerId },
    });
  };
  const acceptGame = (gameId: string) => {
    sendMsg({
      route: "game",
      action: "game-accept",
      payload: { gameId },
    });
  };
  const gameEndedMessage = () => {
    sendMsg({
      route: "game",
      action: "game-ended",
      payload: { e: "e" },
    });
  };

  useEffect(() => {
    handleFunctionsPool.current.set("game", handleMessage);
  }, []);

  return {
    sendMove,
    drawRequest,
    denyGameRequest,
    resign,
    requestRandomGame,
    cancelRandomGame,
    requestGameToFriend,
    acceptGame,
    gameEndedMessage,
  };
};

export default useGameWs;
