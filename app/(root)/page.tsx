import Link from "next/link";

export default function Page() {
  return (
    <>
      <Link href={"/signup"}>
        <button className="big-btn main-btn">Crear Cuenta</button>
      </Link>

      <Link href={"/login"}>
        <button className="big-btn secondary-btn">Ingresar</button>
      </Link>

      <Link href={"/about"}>
        <span className="link absolute right-7 bottom-5">
          Información del Programa
        </span>
      </Link>
    </>
  );
}
6;
