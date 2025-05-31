"use client";

import { createContext, useContext } from "react";
import { Session } from "../models/Session";

type AuthContextProviderProps = {
  children: React.ReactNode;
  initialSession: string | null;
};

type AuthContextType = {
  session: Session | null;
};

const defaultContext: AuthContextType = {
  session: null,
};

export const AuthContext = createContext(defaultContext);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a provider");
  }
  return context as AuthContextType;
}

export const AuthContextProvider = ({ children, initialSession }: AuthContextProviderProps) => {
  const session = initialSession ? JSON.parse(initialSession) : null;
  return <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>;
};
