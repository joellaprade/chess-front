"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import login from "@/reusable/actions/login";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);

  const checkIsValid = () => {
    if (!username || !password) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
  };

  useEffect(() => {
    checkIsValid();
  }, [username, password]);

  return (
    <>
      <form className="w-full" action={login}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Nombre de Usuario"
          name="username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Contraseña"
          name="password"
        />
        <Link className="link" href={"forgot-password"}>
          Olvidé mi Contraseña
        </Link>
        <button
          type={`${isValid ? "submit" : "button"}`}
          className={`big-btn main-btn mt-6 transition-opacity duration-300 ${isValid ? "" : "opacity-50"}`}
        >
          Ingresar
        </button>
      </form>
    </>
  );
}
