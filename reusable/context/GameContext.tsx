"use client";

import { createContext, createRef, useContext, useRef } from "react";
import { PlayerData } from "../types/PlayerData";

type GameContextProviderProps = {
  children: React.ReactNode;
};

type GameContextType = {
  playersData: React.RefObject<PlayerData[]>;
  isThisPlayerWhite: React.RefObject<boolean>;
};

const defaultContext: GameContextType = {
  playersData: { current: [] }, // manually create a ref-like object
  isThisPlayerWhite: { current: false }, // manually create a ref-like object
};

export const GameContext = createContext(defaultContext);

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a provider");
  }
  return context as GameContextType;
}

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const playersData = useRef([]);
  const isThisPlayerWhite = useRef(false);
  return (
    <GameContext.Provider value={{ playersData, isThisPlayerWhite }}>
      {children}
    </GameContext.Provider>
  );
};
