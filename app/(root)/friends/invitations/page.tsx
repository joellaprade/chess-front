"use client";

import GameReqList from "@/components/GameReqList";
import FriendReqList from "@/components/FriendReqList";
import ToggleSwitch from "@/components/ToggleSwitch";
import { useState } from "react";

export default function Page() {
  const [selected, setSelected] = useState(0);

  const getChange = (index: number) => {
    setSelected(index);
  };

  return (
    <>
      <ToggleSwitch className="absolute top-10" getChange={getChange} />
      {selected == 0 && <GameReqList />}
      {selected == 1 && <FriendReqList />}
    </>
  );
}
