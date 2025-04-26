import Link from "next/link";

export default function Page() {
  return (
    <div className="mt-30 flex w-full flex-1 flex-col items-start">
      <h2>Usuario</h2>
      <Link className="w-full" href={"/settings/change-profile-picture"}>
        <button className="big-btn main-btn">Cambiar foto de perfil</button>
      </Link>
    </div>
  );
}
