"use client";
import { useGameContext } from "@/reusable/context/GameContext";
import useGameWs from "@/reusable/hooks/game/useGameWs";
import { useEffect, useState } from "react";

const GameBtn = () => {
  const { requestRandomGame, cancelRandomGame } = useGameWs();
  const { isSearchingForGame } = useGameContext();
  const [isSearching, setIsSearching] = useState(false);

  const handleClick = () => {
    isSearchingForGame.current = !isSearching;
    setIsSearching(!isSearching);
    if (!isSearching) {
      requestRandomGame();
    } else {
      cancelRandomGame();
    }
  };

  useEffect(() => {
    setIsSearching(isSearchingForGame.current);
  }, [isSearchingForGame.current]);

  return (
    <button onClick={handleClick} className={`${isSearching ? "opacity-50" : ""} big-btn main-btn`}>
      {isSearching ? "Has clic para cancelar..." : "Jugar"}
    </button>
  );
};

export default GameBtn;
