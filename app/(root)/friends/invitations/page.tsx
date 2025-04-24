"use client";

import GameReqList from "@/components/home/GameReqList";
import FriendReqList from "@/components/home/FriendReqList";
import ToggleSwitch from "@/components/home/ToggleSwitch";
import { useState } from "react";

export default function Page() {
  const [selected, setSelected] = useState(0);

  const getChange = (index: number) => {
    setSelected(index);
  };

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-10 pt-10">
      <ToggleSwitch getChange={getChange} />
      {selected == 0 && <GameReqList />}
      {selected == 1 && <FriendReqList />}
    </div>
  );
}
