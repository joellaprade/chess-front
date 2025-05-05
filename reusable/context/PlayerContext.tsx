"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Player } from "../models/Player";
import PlayerController from "./PlayerController";

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
  setFriends: React.Dispatch<React.SetStateAction<Player[]>>; // ✅ Correct;
  setFriendReqs: React.Dispatch<React.SetStateAction<Player[]>>; // ✅ Correct
  setGameReqs: React.Dispatch<React.SetStateAction<Player[]>>; // ✅ Correct
};

const defaultPlayer: PlayerContextType = {
  friends: [],
  friendReqs: [],
  gameReqs: [],
  setFriends: () => {},
  setFriendReqs: () => {},
  setGameReqs: () => {},
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
  const [friends, setFriends] = useState<Player[]>(parsedPlayer?.friends || []);
  const [friendReqs, setFriendReqs] = useState<Player[]>(
    parsedPlayer?.friendReqs || [],
  );
  const [gameReqs, setGameReqs] = useState<Player[]>(
    parsedPlayer?.gameReqs || [],
  );

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
      <PlayerController />
    </PlayerContext.Provider>
  );
};
