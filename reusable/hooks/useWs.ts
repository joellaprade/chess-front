"use client";
import { useEffect, useRef, useState } from "react";
import { useWsContext } from "../context/WsContext";
import { useAuth } from "../context/AuthContext";
import { Instruction } from "../types/instruction";
import { usePathname, useRouter } from "next/navigation";
import { useGameContext } from "../context/GameContext";

const useWs = () => {
  const { iMsg, oMsg, connected, setIMsg, setOMsg, ws } = useWsContext();
  const { playersData, isThisPlayerWhite, gameId } = useGameContext();
  const userId = useAuth().session?.userId;
  const wssUrl = process.env.NEXT_PUBLIC_WS_BACKEND_URL;
  const pathname = usePathname();
  const router = useRouter();

  const connect = () => {
    const isReconnect = localStorage.getItem("gameId") != undefined && pathname == "/game";

    if (!userId || !wssUrl || ["/login"].includes(pathname) || connected.current) return;
    connected.current = true;

    try {
      const wsRes = new WebSocket(wssUrl);
      ws.current = wsRes;
      initWs(ws.current, isReconnect);
    } catch (e) {
      console.error(e);
    }
  };
  const close = () => {
    if (!connected.current) ws.current?.close();
  };
  const initWs = (ws: WebSocket, isReconnect: boolean) => {
    ws.onopen = () => {
      connected.current = true;
      if (isReconnect) {
        setTimeout(() => {
          ws.send(
            JSON.stringify({
              action: "reconnect",
              payload: { gameId: gameId.current, userId },
            }),
          );
        }, 1000);
      }
    };
    ws.onclose = () => (connected.current = false);
    ws.onmessage = ({ data }: { data: string }) => {
      const message = JSON.parse(data);
      setIMsg(message);
    };
  };
  const sendMsg = () => {
    if (!ws || !oMsg || !connected.current) return;

    ws.current?.send(JSON.stringify(oMsg));
  };
  const runReplyAction = (notif: Instruction) => {
    const reply = notif.replyAction;
    if (!reply) return;

    setOMsg({ ...reply });
  };
  const handleMessage = () => {
    switch (iMsg?.action) {
      case "start-game":
        redirectToGame(iMsg.payload);
        break;
    }
  };

  // Logic
  const redirectToGame = (payload: any[]) => {
    const [p1, p2, gameId_, isWhite] = payload;
    playersData.current = [p1, p2];
    isThisPlayerWhite.current = isWhite;
    gameId.current = gameId_;

    localStorage.setItem("playerData", JSON.stringify([p1, p2]));
    localStorage.setItem("isThisPlayerWhite", JSON.stringify(isWhite));
    localStorage.setItem("gameId", JSON.stringify(gameId_));

    router.push("/game");
  };

  // Messages
  const requestGameToFriend = (playerId: string) => {
    setOMsg({
      action: "game-request",
      payload: { playerId },
    });
  };
  const sendAddRequest = (username: string) => {
    setOMsg({
      action: "add-friend",
      payload: { username },
    });
  };
  const addFriend = (username: string) => {
    setOMsg({
      action: "add-friend",
      payload: { username },
    });
  };
  const handleRemoveFriend = (username: string) => {
    setOMsg({
      action: "remove-friend",
      payload: { username },
    });
  };

  // useEffect(() => console.log(iMsg), [iMsg]);
  useEffect(handleMessage, [iMsg]);
  useEffect(sendMsg, [oMsg]);
  useEffect(connect, [userId]);
  useEffect(close, [connected.current]);

  return {
    connect,
    redirectToGame,
    requestGameToFriend,
    sendAddRequest,
    addFriend,
    handleRemoveFriend,
    runReplyAction,
  };
};

export default useWs;
