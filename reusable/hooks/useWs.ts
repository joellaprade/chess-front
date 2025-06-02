"use client";
import { useEffect, useRef, useState } from "react";
import { useWsContext } from "../context/WsContext";
import { useAuth } from "../context/AuthContext";
import { Instruction } from "../types/instruction";
import { usePathname, useRouter } from "next/navigation";
import { useGameContext } from "../context/GameContext";

const useWs = () => {
  const { connected, ws, handleFunctionsPool } = useWsContext();
  const { gameId } = useGameContext();
  const userId = useAuth().session?.userId;
  const wssUrl = process.env.NEXT_PUBLIC_WS_BACKEND_URL;
  const pathname = usePathname();

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
          sendMsg({
            route: "game",
            action: "reconnect",
            payload: { gameId: gameId.current, userId },
          });
        }, 1000);
      }
    };
    ws.onclose = close;
    ws.onmessage = ({ data }: { data: string }) => {
      const message: Instruction = JSON.parse(data);
      handleMessage(message);
    };
  };
  const sendMsg = (msg: Instruction) => {
    if (!ws || !connected.current) return;

    ws.current?.send(JSON.stringify(msg));
  };
  const runReplyAction = (instruction: Instruction) => {
    const reply = instruction.replyAction;
    if (!reply) return;

    sendMsg(reply);
  };
  const handleMessage = (message: Instruction) => {
    const targetFunction = handleFunctionsPool.current.get(message.route);
    if (targetFunction) targetFunction(message);
  };

  // Messages
  const requestGameToFriend = (playerId: string) => {
    sendMsg({
      route: "homepage",
      action: "game-request",
      payload: { playerId },
    });
  };
  const sendAddRequest = (username: string) => {
    sendMsg({
      route: "homepage",
      action: "add-friend",
      payload: { username },
    });
  };
  const addFriend = (username: string) => {
    sendMsg({
      route: "homepage",
      action: "add-friend",
      payload: { username },
    });
  };
  const handleRemoveFriend = (username: string) => {
    sendMsg({
      route: "homepage",
      action: "remove-friend",
      payload: { username },
    });
  };

  useEffect(connect, [userId]);
  useEffect(close, [connected.current]);

  return {
    sendMsg,
    connect,
    requestGameToFriend,
    sendAddRequest,
    addFriend,
    handleRemoveFriend,
    runReplyAction,
  };
};

export default useWs;
