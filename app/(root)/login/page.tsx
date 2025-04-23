import Link from "next/link";

export default function Page() {
  return (
    <>
      <form className="w-full" action="">
        <input type="text" placeholder="Nombre de Usuario" />
        <input type="text" placeholder="Contraseña" />
        <Link className="link" href={"forgot-password"}>
          Olvidé mi Contraseña
        </Link>
        <button className="big-btn main-btn mt-6">Ingresar</button>
      </form>
    </>
  );
}
