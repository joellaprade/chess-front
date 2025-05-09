"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import login from "@/reusable/actions/login";
import useFetchServerAction from "@/reusable/hooks/fetchAction";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);

  const { data, loading, error, fetchData } = useFetchServerAction(login);

  const checkIsValid = () => {
    if (!username || !password) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
  };

  useEffect(checkIsValid, [username, password]);
  useEffect(() => {
    if (data) window.location.href = "/";
  }, [data]);

  return (
    <>
      <form
        className="w-full"
        action={(formData: FormData) => fetchData(formData)}
      >
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
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
        <span className="error">{error}</span>
        <Link className="link" href={"/change-password/request"}>
          Olvidé mi Contraseña
        </Link>
        <button
          type={`${isValid && !loading ? "submit" : "button"}`}
          className={`big-btn main-btn mt-6 transition-opacity duration-300 ${isValid && !loading ? "" : "opacity-50"}`}
        >
          {loading ? "Enviando..." : "Ingresar"}
        </button>
      </form>
    </>
  );
}
