"use client";
import { useEffect, useState } from "react";
import { useWsContext } from "../context/WsContext";
import { redirect } from "next/navigation";
import { useGameContext } from "../context/GameContext";
import { PlayerData } from "../types/PlayerData";

const useGame = () => {
  const { iMsg, oMsg, setIMsg, setOMsg } = useWsContext();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { playersData, isThisPlayerWhite } = useGameContext();

  // MESSAGES
  const requestGameToFriend = (playerId: string) => {
    setOMsg({
      action: "game-request",
      payload: { playerId },
    });
  };

  // LOGIC
  const redirectToGame = (message: any[]) => {
    const [p1, p2, gameId, isWhite] = message;
    playersData.current = [p1, p2];
    isThisPlayerWhite.current = isWhite;

    document.cookie = `gameId=${gameId}; path=/; secure; SameSite=Strict`;
    redirect("/game");
  };
  const handleIMsg = () => {
    switch (iMsg?.action) {
      case "start-game":
        redirectToGame(iMsg.payload);
        console.log(iMsg?.payload);
        setIMsg(null);
        break;
    }
  };

  useEffect(handleIMsg, [iMsg]);

  return { requestGameToFriend };
};

export default useGame;
