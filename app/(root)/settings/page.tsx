"use client";

import logout from "@/reusable/actions/logout";
import useFetchServerAction from "@/reusable/hooks/fetchAction";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  const { data, fetchData } = useFetchServerAction(logout);

  useEffect(() => {
    if (data) window.location.href = "/";
  });

  return (
    <div className="mt-30 flex w-full flex-1 flex-col items-start gap-10">
      <h2>Usuario</h2>
      <Link className="w-full" href={"/settings/change-profile-picture"}>
        <button className="big-btn main-btn">Cambiar foto de perfil</button>
      </Link>
      <form className="w-full" action={fetchData}>
        <button className="big-btn main-btn">Cerrar Sessión</button>
      </form>
    </div>
  );
}
