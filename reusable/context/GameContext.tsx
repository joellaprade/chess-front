"use client";

import { createContext, createRef, useContext, useEffect, useRef, useState } from "react";
import { PlayerData } from "../types/PlayerData";

type GameContextProviderProps = {
  children: React.ReactNode;
};

type GameContextType = {
  playersData: React.RefObject<PlayerData[]>;
  isThisPlayerWhite: React.RefObject<boolean>;
  gameId: React.RefObject<string | null>;
};

const defaultContext: GameContextType = {
  playersData: { current: [] }, // manually create a ref-like object
  isThisPlayerWhite: { current: false }, // manually create a ref-like object
  gameId: { current: null },
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
  const playersData = useRef<any[]>([]);
  const isThisPlayerWhite = useRef<boolean>(false);
  const gameId = useRef<string | null>(null);

  const [isHydrated, setIsHydrated] = useState(false); // to delay rendering

  useEffect(() => {
    const LSPlayerData = JSON.parse(localStorage.getItem("playerData") || "null");
    const LSIsThisPlayerWhite = JSON.parse(localStorage.getItem("isThisPlayerWhite") || "null");
    const LSGameId = JSON.parse(localStorage.getItem("gameId") || "null");

    playersData.current = LSPlayerData || [];
    isThisPlayerWhite.current = LSIsThisPlayerWhite || false;
    gameId.current = LSGameId || null;

    setIsHydrated(true); // we're safe to render now
  }, []);

  // Optional: delay rendering until data is loaded
  if (!isHydrated) return null;
  return (
    <GameContext.Provider value={{ playersData, isThisPlayerWhite, gameId }}>
      {children}
    </GameContext.Provider>
  );
};
