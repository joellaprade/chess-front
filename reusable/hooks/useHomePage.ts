"use client";
import { useHomePageContext } from "../context/HomePageContext";
import { Player } from "../models/Player";
import { Instruction } from "../types/instruction";
import { useEffect, useRef } from "react";
import { useWsContext } from "../context/WsContext";
import { useGameContext } from "../context/GameContext";
import { useRouter } from "next/navigation";
import useWs from "./useWs";
import useResetGameBoard from "@/reusable/hooks/resetGameBoard";

const useHomePage = () => {
  const { reset } = useResetGameBoard();
  const { sendMsg } = useWs();
  const { playersData, isThisPlayerWhite, gameId, isSearchingForGame } = useGameContext();
  const { handleFunctionsPool } = useWsContext();
  const { setFriends, setFriendReqs, setGameReqs, notificationHandler } = useHomePageContext();
  const router = useRouter();

  // RESPONDERS
  const handlePlayerLeft = () => {
    isSearchingForGame.current = false;
  };
  const handleNewFriendReq = (player: Player) => {
    setFriendReqs((prevState) => [...prevState, player]);
  };
  const handleGameRequest = (gameReq: Record<string, any>) => {
    setGameReqs((prevState) => [...prevState, gameReq]);
  };
  const handleNewFriend = (player: Player) => {
    setFriendReqs((prevState) => prevState.filter((fReq) => fReq.username !== player.username));

    setFriends((prevState) => [...prevState, player]);
  };
  const handleRemoveFriend = (username: string) => {
    setFriends(
      (prevState) => (prevState = prevState.filter((player) => player.username !== username)),
    );
  };
  const handleOnlineStatus = (isOnline: boolean, username: string) => {
    setFriends((prevState) =>
      prevState.map((player) => (player.username === username ? { ...player, isOnline } : player)),
    );
  };
  const handleStartGame = (payload: any[]) => {
    reset();
    const [p1, p2, gameId_, isWhite] = payload;
    playersData.current = [p1, p2];
    isThisPlayerWhite.current = isWhite;
    gameId.current = gameId_;

    localStorage.setItem("board", "");
    localStorage.setItem("playerData", JSON.stringify([p1, p2]));
    localStorage.setItem("isThisPlayerWhite", JSON.stringify(isWhite));
    localStorage.setItem("gameId", JSON.stringify(gameId_));
    localStorage.setItem("isWhiteTurn", JSON.stringify(true));

    router.push("/game");
  };
  const handleMessage = (instruction: Instruction) => {
    switch (instruction.action) {
      case "notify-player-left":
        handlePlayerLeft();
      case "notify-friend-request":
        handleNewFriendReq(instruction.payload);
        break;
      case "notify-game-request":
        handleGameRequest(instruction.payload);
        break;
      case "notify-only-new-friend":
        handleNewFriend(instruction.payload);
        break;
      case "notify-only-is-online":
        handleOnlineStatus(true, instruction.payload.username);
        break;
      case "notify-only-is-not-online":
        handleOnlineStatus(false, instruction.payload.username);
        break;
      case "notify-only-removed-friend":
        handleRemoveFriend(instruction.payload.username);
        break;
      case "notify-friend-request":
        handleNewFriendReq(instruction.payload);
        break;
      case "start-game":
        handleStartGame(instruction.payload);
        break;
    }
    notificationHandler.current!(instruction);
  };

  // MESSAGES
  const requestRandomGame = () => {
    sendMsg({
      route: "homepage",
      action: "random-game-request",
      payload: { e: null },
    });
  };
  const cancelRandomGame = () => {
    sendMsg({
      route: "homepage",
      action: "random-game-cancel",
      payload: { e: null },
    });
  };
  const requestGameToFriend = (playerId: string) => {
    sendMsg({
      route: "homepage",
      action: "game-request",
      payload: { playerId },
    });
  };
  const acceptGame = (gameId: string) => {
    sendMsg({
      route: "homepage",
      action: "game-accept",
      payload: { gameId },
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
  const removeFriend = (username: string) => {
    sendMsg({
      route: "homepage",
      action: "remove-friend",
      payload: { username },
    });
  };
  const denyFriendRequest = (username: string) => {
    setFriendReqs((prevState) => prevState.filter((req) => req.username !== username));
    sendMsg({
      route: "homepage",
      action: "friend-denied",
      payload: { username },
    });
  };
  const denyGameRequest = (gameId: string) => {
    setGameReqs((prevState) => prevState.filter((req) => req.gameId !== gameId));
    sendMsg({
      route: "homepage",
      action: "game-denied",
      payload: { gameId },
    });
  };

  useEffect(() => {
    handleFunctionsPool.current.set("homepage", handleMessage);
  }, []);

  return {
    notificationHandler,
    requestGameToFriend,
    acceptGame,
    sendAddRequest,
    addFriend,
    removeFriend,
    denyFriendRequest,
    denyGameRequest,
    requestRandomGame,
    cancelRandomGame,
  };
};

export default useHomePage;
