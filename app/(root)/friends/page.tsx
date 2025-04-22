import Friend from "@/components/Friend";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div>
        <Friend />
      </div>
      <Link href={"/invitations"}>
        <button className="big-btn secondary-btn">Agregar Amigo</button>
      </Link>
    </>
  );
}
