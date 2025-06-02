"use client";

import GameReqList from "@/reusable/components/home/GameReqList";
import FriendReqList from "@/reusable/components/home/FriendReqList";
import ToggleSwitch from "@/reusable/components/home/ToggleSwitch";
import { useState } from "react";
import { useHomePageContext } from "@/reusable/context/HomePageContext";

export default function Page() {
  const [selected, setSelected] = useState(0);
  const { friendReqs, gameReqs } = useHomePageContext();

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-10 pt-10">
      <ToggleSwitch getChange={setSelected} />
      {selected == 0 && <GameReqList reqs={gameReqs} />}
      {selected == 1 && <FriendReqList reqs={friendReqs} />}
    </div>
  );
}
