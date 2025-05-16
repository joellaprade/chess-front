"use client";

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
  const { handleMove } = useBoard();
  const { setShowQueenPopup } = useBoardContext();

  const getPiece = (p: string) => {
    setShowQueenPopup(false);
    handleMove(p, destination);
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
