"use client";

import { useBoardContext } from "@/reusable/context/BoardContext";
import useBoard from "@/reusable/hooks/game/useBoard";
import Image from "next/image";

const Board = ({ isWhite }: { isWhite: boolean }) => {
  const { board } = useBoardContext();
  const { getColor, handlePieceClick, colorLegalSquares, renderQueenPopup } = useBoard();

  const renderBoard = () => {
    const finalBoard = isWhite
      ? board
      : [...board]
          .slice()
          .reverse()
          .map((row) => [...row].slice().reverse());

    return finalBoard.map((row, rI) => (
      <div className="row" key={rI}>
        {row.map((square, cI) => (
          <div
            className={`square ${getColor(square.id)} ${colorLegalSquares(square.id)}`}
            onClick={() => handlePieceClick(square)}
            key={cI}
          >
            {/* <span className="absolute">{square.id}</span> */}
            {square.piece && (
              <Image src={`/assets/pieces/${square.piece}.png`} width={100} height={100} alt="" />
            )}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="board">
      {renderBoard()}
      {renderQueenPopup()}
    </div>
  );
};

export default Board;
