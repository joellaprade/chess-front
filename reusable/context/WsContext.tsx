"use client";
import { createContext, useContext, useRef, useState } from "react";

type WsContextProviderProps = {
  children: React.ReactNode;
};

type WsContextType = {
  ws: React.RefObject<WebSocket | null>;
  connected: React.RefObject<boolean>;
  handleFunctionsPool: React.RefObject<Map<string, Function>>;
};

const WsDefaultValues: WsContextType = {
  ws: { current: null },
  connected: { current: false },
  handleFunctionsPool: { current: new Map() },
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
  const connected = useRef(false);
  const handleFunctionsPool = useRef(new Map());

  return (
    <WsContext.Provider value={{ ws, connected, handleFunctionsPool }}>
      {children}
    </WsContext.Provider>
  );
};
