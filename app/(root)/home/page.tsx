import Link from "next/link";
import GameBtn from "./GameBtn";

export default function Page() {
  return (
    <>
      <GameBtn />

      <Link className="w-full" href={"/friends"}>
        <button className="big-btn secondary-btn">Amigos</button>
      </Link>

      <Link className="w-full" href={"/settings"}>
        <button className="big-btn secondary-btn">Ajustes</button>
      </Link>

      <Link href={"/about"}>
        <span className="link absolute right-7 bottom-5">Información del Programa</span>
      </Link>
    </>
  );
}
