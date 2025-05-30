"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useWsContext } from "./WsContext";

type NotificationContextProviderProps = {
  children: React.ReactNode;
};

type NotificationContextType = {
  notif: unknown;
  setNotif: (data: unknown) => void;
};

const defaultValues: NotificationContextType = {
  notif: null,
  setNotif: (data: unknown) => null,
};

export const NotificationContext = createContext(defaultValues);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a provider");
  }

  return context;
};

export const NotificationContextProvider = ({ children }: NotificationContextProviderProps) => {
  const [notif, setNotif] = useState<unknown>(null);
  const { iMsg } = useWsContext();

  useEffect(() => setNotif(iMsg), [iMsg]);

  return (
    <NotificationContext.Provider value={{ notif, setNotif }}>
      {children}
    </NotificationContext.Provider>
  );
};
