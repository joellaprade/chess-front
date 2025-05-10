"use client";

import { useBoardContext } from "@/reusable/context/BoardContext";
import useBoard from "@/reusable/hooks/useBoard";
import Image from "next/image";
import { useState } from "react";

const Board = ({ isBlack }: { isBlack: boolean }) => {
  const { board, setBoard, selectedSquare, setSelectedSquare } =
    useBoardContext();
  const { getSquareById, movePiece, getColor, handlePieceClick } = useBoard();

  const renderBoard = () => {
    const finalBoard = !isBlack
      ? board
      : [...board]
          .slice()
          .reverse()
          .map((row) => [...row].slice().reverse());

    return finalBoard.map((row, i) => (
      <div className="row" key={i}>
        {row.map((square, i) => (
          <div
            className={`square ${getColor(square.id)}`}
            onClick={() => handlePieceClick(square.id)}
            key={i}
          >
            {square.piece && (
              <Image
                src={`/assets/pieces/${square.piece}.png`}
                width={100}
                height={100}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    ));
  };

  return <div className="board">{renderBoard()}</div>;
};

export default Board;
