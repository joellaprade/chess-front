"use client";

import { handleChangePasswordRequest } from "@/reusable/actions/handleChangePasswordRequest";
import useFetchServerAction from "@/reusable/hooks/fetchAction";
import { useEffect, useState } from "react";

const Page = () => {
  const { data, loading, error, fetchData } = useFetchServerAction(
    handleChangePasswordRequest,
  );
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState<string>("");

  const checkIsValid = () => {
    if (!email) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
  };
  useEffect(checkIsValid, [email]);

  useEffect(() => {
    if (data) window.location.href = "/";
  }, [data]);

  return (
    <>
      <h2>Introdusca su correo electrónico:</h2>
      <form
        className="w-full"
        action={(formData: FormData) => {
          fetchData(formData);
        }}
      >
        <input
          name="email"
          placeholder="Correo Electrónico"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
