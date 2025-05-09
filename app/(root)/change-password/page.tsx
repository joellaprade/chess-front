"use client";

import { changePassword } from "@/reusable/actions/changePassword";
import useFetchServerAction from "@/reusable/hooks/fetchAction";
import { useEffect, useState } from "react";

const Page = () => {
  const { data, loading, error, fetchData } =
    useFetchServerAction(changePassword);
  const [isValid, setIsValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const checkIsValid = () => {
    if (
      !password ||
      !confirmPassword ||
      !code ||
      password !== confirmPassword
    ) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
  };
  useEffect(checkIsValid, [password, confirmPassword, code]);

  useEffect(() => {
    if (data) window.location.href = "/";
  });

  return (
    <>
      <h2>
        Introdusca el código que se envió a su correo, seguido de su nueva
        contraseña
      </h2>
      <form
        className="w-full"
        action={(formData) => {
          fetchData(formData);
        }}
      >
        <input
          className="mt-5"
          name="password"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          placeholder="Confirmar Contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input
          name="code"
          placeholder="Código"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <span className={`${!error && "hidden"} error`}>{error}</span>

        <button
          type={`${isValid && !loading ? "submit" : "button"}`}
          className={`${isValid && !loading ? "" : "opacity-50"} big-btn main-btn mt-5`}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </>
  );
};

export default Page;
