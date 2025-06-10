"use client";
import useGameWs from "@/reusable/hooks/game/useGameWs";
import { useState } from "react";

const GameBtn = () => {
  const { requestRandomGame, cancelRandomGame } = useGameWs();
  const [isSearching, setIsSearching] = useState(false);

  const handleClick = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      requestRandomGame();
    } else {
      cancelRandomGame();
    }
  };

  return (
    <button onClick={handleClick} className={`${isSearching ? "opacity-50" : ""} big-btn main-btn`}>
      {isSearching ? "Has clic para cancelar..." : "Jugar"}
    </button>
  );
};

export default GameBtn;
