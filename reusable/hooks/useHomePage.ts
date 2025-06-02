"use client";
import { useHomePageContext } from "../context/HomePageContext";
import { Player } from "../models/Player";
import { Instruction } from "../types/instruction";
import { useEffect, useRef } from "react";
import { useWsContext } from "../context/WsContext";
import { useGameContext } from "../context/GameContext";
import { useRouter } from "next/navigation";

const useHomePage = () => {
  const { playersData, isThisPlayerWhite, gameId } = useGameContext();
  const { handleFunctionsPool } = useWsContext();
  const { setFriends, setFriendReqs } = useHomePageContext();
  const router = useRouter();
  const notificationHandler = useRef<Function | null>(null);

  const handleNewFriendReq = (player: Player) => {
    setFriendReqs((prevState) => [...prevState, player]);
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
    const [p1, p2, gameId_, isWhite] = payload;
    playersData.current = [p1, p2];
    isThisPlayerWhite.current = isWhite;
    gameId.current = gameId_;

    localStorage.setItem("playerData", JSON.stringify([p1, p2]));
    localStorage.setItem("isThisPlayerWhite", JSON.stringify(isWhite));
    localStorage.setItem("gameId", JSON.stringify(gameId_));

    router.push("/game");
  };
  const handleMessage = (instruction: Instruction) => {
    switch (instruction.action) {
      case "notify-friend-request":
        handleNewFriendReq(instruction.payload);
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
      case "start-game":
        handleStartGame(instruction.payload);
        break;
    }
    notificationHandler.current!(instruction);
  };

  useEffect(() => {
    handleFunctionsPool.current.set("homepage", handleMessage);
  }, []);

  return { notificationHandler };
};

export default useHomePage;
