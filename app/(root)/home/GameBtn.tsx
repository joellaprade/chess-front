"use client";
import { useGameContext } from "@/reusable/context/GameContext";
import useHomePage from "@/reusable/hooks/useHomePage";
import { useEffect, useState } from "react";

const GameBtn = () => {
  const { requestRandomGame, cancelRandomGame } = useHomePage();
  const { isSearchingForGame } = useGameContext();
  const [isSearching, setIsSearching] = useState(false);

  const handleClick = () => {
    console.log(isSearching);
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
