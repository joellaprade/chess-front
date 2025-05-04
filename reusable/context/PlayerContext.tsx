"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Player } from "../models/Player";

type PlayerContextProviderProps = {
  children: React.ReactNode;
  playerData: string | null;
};

type player = {
  friends: Array<Player>;
  friendReqs: Array<Player>;
  gameReqs: Array<Player>;
};

type PlayerContextType = {
  friends: Array<Player>;
  friendReqs: Array<Player>;
  gameReqs: Array<Player>;
  setFriends: (friends: Array<Player>) => void;
  setFriendReqs: (friendReqs: Array<Player>) => void;
  setGameReqs: (gameReqs: Array<Player>) => void;
};

const defaultPlayer: PlayerContextType = {
  friends: [],
  friendReqs: [],
  gameReqs: [],
  setFriends: (friends: Array<Player>) => null,
  setFriendReqs: (friendReqs: Array<Player>) => null,
  setGameReqs: (gameReqs: Array<Player>) => null,
};

export const PlayerContext = createContext(defaultPlayer);

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (context) {
    return context;
  } else {
    throw new Error("Must use within provider");
  }
};

export const PlayerContextProvider = ({
  children,
  playerData,
}: PlayerContextProviderProps) => {
  let parsedPlayer: player = playerData ? JSON.parse(playerData) : null;
  const [friends, setFriends] = useState(parsedPlayer?.friends || []);
  const [friendReqs, setFriendReqs] = useState(parsedPlayer?.friendReqs || []);
  const [gameReqs, setGameReqs] = useState(parsedPlayer?.gameReqs || []);

  return (
    <PlayerContext.Provider
      value={{
        friends,
        friendReqs,
        gameReqs,
        setFriends,
        setFriendReqs,
        setGameReqs,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
