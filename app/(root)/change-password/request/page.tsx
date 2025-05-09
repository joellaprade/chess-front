"use client";

import { handleChangePasswordRequest } from "@/reusable/actions/handleChangePasswordRequest";
import useFetchServerAction from "@/reusable/hooks/fetchAction";
import { useEffect } from "react";

const Page = () => {
  const { data, loading, fetchData } = useFetchServerAction(
    handleChangePasswordRequest,
  );

  useEffect(() => {
    if (data) window.location.href = "/";
  });

  return (
    <>
      <h2>Introdusca su correo electrónico:</h2>
      <form className="w-full" action={fetchData}>
        <input name="email" placeholder="Correo Electrónico" type="text" />
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
