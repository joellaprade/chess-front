import Link from "next/link";

export default function Page() {
  return (
    <>
      <Link className="w-full" href={"/game"}>
        <button className="big-btn main-btn">Jugar</button>
      </Link>

      <Link className="w-full" href={"/friends"}>
        <button className="big-btn secondary-btn">Amigos</button>
      </Link>
    </>
  );
}
6;
