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

  const handlePieceChange = (p: string) => {
    setShowQueenPopup(false);
    handleMove(p, destination);
  };

  return (
    <div className="queen-popup-wrapper">
      <div className="queen-popup">
        <div className="flex gap-5">
          <PopupPiece onClick={handlePieceChange} piece={`${color}Q`} />
          <PopupPiece onClick={handlePieceChange} piece={`${color}R`} />
        </div>
        <div className="flex gap-5">
          <PopupPiece onClick={handlePieceChange} piece={`${color}N`} />
          <PopupPiece onClick={handlePieceChange} piece={`${color}B`} />
        </div>
      </div>
    </div>
  );
};

export default QueenPopup;
