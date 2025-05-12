"use client";

import { useBoardContext } from "@/reusable/context/BoardContext";
import useBoard from "@/reusable/hooks/game/useBoard";
import Image from "next/image";

const Board = ({ isBlack }: { isBlack: boolean }) => {
  const { board } = useBoardContext();
  const { getColor, handlePieceClick } = useBoard();

  const renderBoard = () => {
    const finalBoard = !isBlack
      ? board
      : [...board]
          .slice()
          .reverse()
          .map((row) => [...row].slice().reverse());

    return finalBoard.map((row, rI) => (
      <div className="row" key={rI}>
        {row.map((square, cI) => (
          <div
            className={`square ${getColor(square.id)}`}
            onClick={() => handlePieceClick(square.id)}
            key={cI}
          >
            <span className="absolute">{square.id}</span>
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
