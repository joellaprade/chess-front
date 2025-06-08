"use client";
import { useGameContext } from "@/reusable/context/GameContext";
import useGameWs from "@/reusable/hooks/game/useGameWs";
import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";

const GameOptions = () => {
  const [selectValue, setSelectValue] = useState("");
  const { drawRequest, resign } = useGameWs();
  const { isThisPlayerWhite, setIsCheckMate } = useGameContext();

  useEffect(() => {
    switch (selectValue) {
      case "draw":
        drawRequest();
        break;
      case "resign":
        resign();
        setIsCheckMate(isThisPlayerWhite.current ? "b" : "w");
        break;
    }
    setSelectValue("");
  }, [selectValue]);

  return (
    <div className="game-options">
      <Ellipsis className="h-10 w-10 text-white" />
      <select
        value={selectValue}
        onChange={(e) => setSelectValue(e.target.value)}
        className="bg-dark-brown text-light absolute h-full w-full opacity-0"
        name=""
        id=""
      >
        <option className="hidden" value=""></option>
        <option value="draw">Tregua</option>
        <option value="resign">Resignarse</option>
      </select>
    </div>
  );
};

export default GameOptions;
