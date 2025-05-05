"use client";
import { useEffect } from "react";
import { useNotifications } from "./NotificationContext";
import { useWs } from "./WsContext";
import { usePlayer } from "./PlayerContext";
import { Player } from "../models/Player";

const PlayerController = () => {
  const { iMsg } = useWs();
  const { friends, friendReqs, setFriends, setFriendReqs } = usePlayer();

  const handleNewFriendReq = (player: Player) => {
    setFriendReqs((prevState) => [...prevState, player]);
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

  useEffect(() => {
    console.log(friendReqs);
  }, [friends, friendReqs]);

  useEffect(handleIMsg, [iMsg]);

  return <></>;
};

export default PlayerController;
