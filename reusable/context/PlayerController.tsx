"use client";
import { useEffect } from "react";
import { useWsContext } from "./WsContext";
import { usePlayer } from "./PlayerContext";
import { Player } from "../models/Player";

const PlayerController = () => {
  const { iMsg } = useWsContext();
  const { setFriends, setFriendReqs } = usePlayer();

  const handleNewFriendReq = (player: Player) => {
    setFriendReqs((prevState) => [...prevState, player]);
  };

  const handleNewFriend = (player: Player) => {
    setFriendReqs((prevState) =>
      prevState.filter((fReq) => fReq.username !== player.username),
    );

    setFriends((prevState) => [...prevState, player]);
  };

  const handleRemoveFriend = (username: string) => {
    setFriends(
      (prevState) =>
        (prevState = prevState.filter(
          (player) => player.username !== username,
        )),
    );
  };

  const handleOnlineStatus = (isOnline: boolean, username: string) => {
    setFriends((prevState) =>
      prevState.map((player) =>
        player.username === username ? { ...player, isOnline } : player,
      ),
    );
  };

  const handleIMsg = () => {
    switch (iMsg?.action) {
      case "notify-friend-request":
        handleNewFriendReq(iMsg.payload);
        break;
      case "notify-only-new-friend":
        handleNewFriend(iMsg.payload);
        break;
      case "notify-only-is-online":
        handleOnlineStatus(true, iMsg.payload.username);
        break;
      case "notify-only-is-not-online":
        handleOnlineStatus(false, iMsg.payload.username);
        break;
      case "notify-only-removed-friend":
        handleRemoveFriend(iMsg.payload.username);
        break;
    }
  };

  useEffect(handleIMsg, [iMsg]);

  return <></>;
};

export default PlayerController;
