"use client";
import { createContext, useContext, useRef, useState } from "react";
import { Instruction } from "@/reusable/types/instruction";

type setOMsgOptions =
  | { action: "add-friend"; payload: any }
  | { action: "notify-only"; payload: any }
  | { action: string; payload: any };

type WsContextProviderProps = {
  children: React.ReactNode;
};

type WsContextType = {
  ws: React.RefObject<WebSocket | null>;
  connected: React.RefObject<boolean>;
  iMsg: Instruction | null;
  oMsg: Instruction | null;
  setIMsg: (instruction: Instruction | null) => void;
  setOMsg: (instruction: setOMsgOptions | null) => void;
};

const WsDefaultValues: WsContextType = {
  ws: { current: null },
  connected: { current: false },
  iMsg: null,
  oMsg: null,
  setIMsg: (instruction: Instruction | null) => {},
  setOMsg: (instruction: setOMsgOptions | null) => {},
};

export const WsContext = createContext<WsContextType>(WsDefaultValues);

export const useWsContext = () => {
  const context = useContext(WsContext);
  if (!context) {
    throw new Error("useWS must be used within a provider");
  }

  return context;
};

export const WsContextProvider = ({ children }: WsContextProviderProps) => {
  const ws = useRef<WebSocket | null>(null);
  const [iMsg, setIMsg] = useState<Instruction | null>(null);
  const [oMsg, setOMsg] = useState<setOMsgOptions | null>(null);
  const connected = useRef(false);

  return (
    <WsContext.Provider value={{ ws, connected, iMsg, oMsg, setIMsg, setOMsg }}>
      {children}
    </WsContext.Provider>
  );
};
