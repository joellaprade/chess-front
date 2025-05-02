"use client";
import { createContext, useContext, useState } from "react";
import { Instruction } from "@/reusable/types/instruction";
import WsController from "./WsController";

type WsContextProviderProps = {
  children: React.ReactNode;
};

type WsContextType = {
  connected: boolean;
  iMsg: Instruction | null;
  oMsg: Instruction | null;
  setConnected: (connected: boolean) => void;
  setIMsg: (instruction: Instruction) => void;
  setOMsg: (instruction: Instruction) => void;
};

const WsDefaultValues: WsContextType = {
  connected: false,
  iMsg: null,
  oMsg: null,
  setConnected: (connected: boolean) => {},
  setIMsg: (instruction: Instruction) => {},
  setOMsg: (instruction: Instruction) => {},
};

export const WsContext = createContext<WsContextType>(WsDefaultValues);

export const useWs = () => {
  const context = useContext(WsContext);
  if (!context) {
    throw new Error("useWS must be used within a provider");
  }

  return context;
};

export const WsContextProvider = ({ children }: WsContextProviderProps) => {
  const [connected, setConnected] = useState(false);
  const [iMsg, setIMsg] = useState<Instruction | null>(null);
  const [oMsg, setOMsg] = useState<Instruction | null>(null);

  return (
    <WsContext.Provider
      value={{ connected, iMsg, oMsg, setConnected, setIMsg, setOMsg }}
    >
      {children}
      <WsController />
    </WsContext.Provider>
  );
};
