"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Player } from "../models/Player";

type HomePageContextProviderProps = {
  children: React.ReactNode;
  homePageData: string | null;
};

type player = {
  friends: Array<Player>;
  friendReqs: Array<Player>;
  gameReqs: Array<Player>;
};

type HomePageContextType = {
  friends: Array<Player>;
  friendReqs: Array<Player>;
  gameReqs: Array<Player>;
  setFriends: React.Dispatch<React.SetStateAction<Player[]>>;
  setFriendReqs: React.Dispatch<React.SetStateAction<Player[]>>;
  setGameReqs: React.Dispatch<React.SetStateAction<Player[]>>;
};

const defaultPlayer: HomePageContextType = {
  friends: [],
  friendReqs: [],
  gameReqs: [],
  setFriends: () => {},
  setFriendReqs: () => {},
  setGameReqs: () => {},
};

export const HomePageContext = createContext(defaultPlayer);

export const useHomePageContext = () => {
  const context = useContext(HomePageContext);

  if (context) {
    return context;
  } else {
    throw new Error("Must use within provider");
  }
};

export const HomePageContextProvider = ({
  children,
  homePageData,
}: HomePageContextProviderProps) => {
  let parsedHomePage: player = homePageData ? JSON.parse(homePageData) : null;
  const [friends, setFriends] = useState<Player[]>(parsedHomePage?.friends || []);
  const [friendReqs, setFriendReqs] = useState<Player[]>(parsedHomePage?.friendReqs || []);
  const [gameReqs, setGameReqs] = useState<Player[]>(parsedHomePage?.gameReqs || []);

  return (
    <HomePageContext.Provider
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
    </HomePageContext.Provider>
  );
};
