"use client";

import { verifyMail } from "@/reusable/actions/verifyMail";
import useFetchServerAction from "@/reusable/hooks/fetchAction";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Page = () => {
  const { data, loading, error, fetchData } = useFetchServerAction(verifyMail);

  useEffect(() => {
    if (data) window.location.href = "/";
  });

  return (
    <form className="w-full" action={fetchData}>
      <input name="code" placeholder="Código" type="text" />
      <button
        type={loading ? "button" : "submit"}
        className={`${loading ? "opacity-50" : ""} big-btn main-btn mt-5`}
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
};

export default Page;
