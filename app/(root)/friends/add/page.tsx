"use client";

import Friend from "@/components/home/Friend";

export default function Page() {
  return (
    <div className="mt-10 w-full flex-1">
      <input type="text" placeholder="Nombre de Usuario" />
      <div className="friend-list mt-10">
        <Friend />
        <Friend />
      </div>
    </div>
  );
}
