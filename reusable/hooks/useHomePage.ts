"use client";
import { useHomePageContext } from "../context/HomePageContext";
import { Player } from "../models/Player";
import { Instruction } from "../types/instruction";
import { useEffect } from "react";
import { useWsContext } from "../context/WsContext";
import useWs from "./useWs";

const useHomePage = () => {
  const { sendMsg } = useWs();
  const { handleFunctionsPool } = useWsContext();
  const { setFriends, setFriendReqs, notificationHandler } = useHomePageContext();

  // handlers

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
      case "notify-friend-request":
        handleNewFriendReq(instruction.payload);
        break;
    }
    notificationHandler.current!(instruction);
  };

  // MESSAGES
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

  useEffect(() => {
    handleFunctionsPool.current.set("homepage", handleMessage);
  }, []);

  return {
    notificationHandler,
    sendAddRequest,
    addFriend,
    removeFriend,
    denyFriendRequest,
  };
};

export default useHomePage;
