"use client";

import { useEffect, useState } from "react";
import PopupPiece from "./PopupPiece";
import useBoard from "@/reusable/hooks/game/useBoard";
import { useBoardContext } from "@/reusable/context/BoardContext";

const QueenPopup = ({
  color,
  destination,
}: {
  color: string;
  destination: number;
}) => {
  const { handleQueenUpgrade } = useBoard();
  const { setShowQueenPopup } = useBoardContext();

  const getPiece = (p: string) => {
    console.log(destination, p);
    setShowQueenPopup(false);
    handleQueenUpgrade(p, destination);
  };

  return (
    <div className="queen-popup-wrapper">
      <div className="queen-popup">
        <div className="flex gap-5">
          <PopupPiece onClick={getPiece} piece={`${color}Q`} />
          <PopupPiece onClick={getPiece} piece={`${color}R`} />
        </div>
        <div className="flex gap-5">
          <PopupPiece onClick={getPiece} piece={`${color}N`} />
          <PopupPiece onClick={getPiece} piece={`${color}B`} />
        </div>
      </div>
    </div>
  );
};

export default QueenPopup;
