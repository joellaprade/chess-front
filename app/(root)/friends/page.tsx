import Friend from "@/reusable/components/home/Friend";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Link href={"/friends/invitations"} className="absolute top-0 right-10">
        <Mail className="h-8 w-8 text-white" />
        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-300"></div>
      </Link>
      <div className="friend-list">
        {/* <Friend />
        <Friend /> */}
      </div>
      <Link className="w-full" href={"/friends/add"}>
        <button className="big-btn secondary-btn">Agregar Amigo</button>
      </Link>
    </>
  );
}
