import Link from "next/link";

export default function Page() {
  return (
    <>
      <Link href={"/signup"}>
        <button className="big-btn main-btn">Jugar</button>
      </Link>

      <Link href={"/login"}>
        <button className="big-btn secondary-btn">Amigos</button>
      </Link>
    </>
  );
}
6;
