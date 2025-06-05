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
  isSearchingForGame: React.RefObject<boolean>;
  setIsHydrated: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultGameContext: GameContextType = {
  playersData: { current: [] as PlayerData[] },
  isThisPlayerWhite: { current: false },
  gameId: { current: null },
  isSearchingForGame: { current: false },
  setIsHydrated: () => {},
};

export const GameContext = createContext(defaultGameContext);

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
  const isSearchingForGame = useRef<boolean>(false);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const LSPlayerData = JSON.parse(localStorage.getItem("playerData") || "null");
    const LSIsThisPlayerWhite = JSON.parse(localStorage.getItem("isThisPlayerWhite") || "null");
    const LSGameId = JSON.parse(localStorage.getItem("gameId") || "null");

    playersData.current = LSPlayerData || [];
    isThisPlayerWhite.current = LSIsThisPlayerWhite || false;
    gameId.current = LSGameId || null;

    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;
  return (
    <GameContext.Provider
      value={{ playersData, isThisPlayerWhite, gameId, isSearchingForGame, setIsHydrated }}
    >
      {children}
    </GameContext.Provider>
  );
};
