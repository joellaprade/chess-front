import Link from "next/link";

export default function Page() {
  return (
    <>
      <Link className="w-full" href={"/signup"}>
        <button className="big-btn main-btn">Crear Cuenta</button>
      </Link>

      <Link className="w-full" href={"/login"}>
        <button className="big-btn secondary-btn">Ingresar</button>
      </Link>

      <Link href={"/about"}>
        <span className="link absolute right-7 bottom-5">Información del Programa</span>
      </Link>
    </>
  );
}
