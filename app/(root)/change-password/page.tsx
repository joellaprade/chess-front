"use client";

import { changePassword } from "@/reusable/actions/changePassword";
import useFetchServerAction from "@/reusable/hooks/fetchAction";
import { useEffect } from "react";

const Page = () => {
  const { data, loading, fetchData } = useFetchServerAction(changePassword);

  useEffect(() => {
    if (data) window.location.href = "/";
  });

  return (
    <>
      <h2>
        Introdusca el código que se envió a su correo, seguido de su nueva
        contraseña
      </h2>
      <form className="w-full" action={fetchData}>
        <input
          className="mt-5"
          name="password"
          placeholder="Contraseña"
          type="password"
        />
        <input placeholder="Confirmar Contraseña" type="password" />
        <input name="code" placeholder="Código" type="text" />
        <button
          type={loading ? "button" : "submit"}
          className={`${loading ? "opacity-50" : ""} big-btn main-btn mt-5`}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </>
  );
};

export default Page;
