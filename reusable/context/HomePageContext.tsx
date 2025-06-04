"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Player } from "../models/Player";

type HomePageContextProviderProps = {
  children: React.ReactNode;
  homePageData: string | null;
};

type player = {
  friends: Array<Player>;
  friendReqs: Array<Player>;
  gameReqs: Array<Record<string, any>>;
};

type HomePageContextType = {
  friends: Array<Player>;
  friendReqs: Array<Player>;
  gameReqs: Array<Record<string, any>>;
  notificationHandler: React.RefObject<Function | null>;
  setFriends: React.Dispatch<React.SetStateAction<Player[]>>;
  setFriendReqs: React.Dispatch<React.SetStateAction<Player[]>>;
  setGameReqs: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
};

const defaultPlayer: HomePageContextType = {
  friends: [],
  friendReqs: [],
  gameReqs: [],
  notificationHandler: { current: () => {} },
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
  const [gameReqs, setGameReqs] = useState<Record<string, any>[]>(parsedHomePage?.gameReqs || []);
  const notificationHandler = useRef<Function | null>(null);

  return (
    <HomePageContext.Provider
      value={{
        friends,
        friendReqs,
        gameReqs,
        notificationHandler,
        setFriends,
        setFriendReqs,
        setGameReqs,
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
};
