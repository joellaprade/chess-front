"use client";

import { createContext, createRef, useContext, useEffect, useRef, useState } from "react";
import { PlayerData } from "../types/PlayerData";
import { Instruction } from "../types/instruction";

type GameContextProviderProps = {
  children: React.ReactNode;
};

type GameContextType = {
  playersData: React.RefObject<PlayerData[]>;
  isThisPlayerWhite: React.RefObject<boolean>;
  gameId: React.RefObject<string | null>;
  isWin: string;
  isDraw: boolean;
  incommingMove: Instruction | null;
  resetted: boolean;
  setResetted: React.Dispatch<React.SetStateAction<boolean>>;
  setIncommingMove: React.Dispatch<React.SetStateAction<Instruction | null>>;
  setIsHydrated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWin: React.Dispatch<React.SetStateAction<string>>;
  setIsDraw: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GameContext = createContext({} as GameContextType);

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
  const [isWin, setIsWin] = useState("");
  const [isDraw, setIsDraw] = useState(false);
  const [incommingMove, setIncommingMove] = useState<Instruction | null>(null);
  const [resetted, setResetted] = useState(false);

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
      value={{
        playersData,
        isThisPlayerWhite,
        gameId,
        isWin,
        isDraw,
        incommingMove,
        resetted,
        setResetted,
        setIncommingMove,
        setIsWin,
        setIsDraw,
        setIsHydrated,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
