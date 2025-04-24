"use client";

import Image from "next/image";
import { useState } from "react";

const Board = ({ isBlack }: { isBlack: boolean }) => {
  const defaultBoard = [
    [
      // 8
      { id: 0, code: "a8", piece: "bR" },
      { id: 1, code: "b8", piece: "bN" },
      { id: 2, code: "c8", piece: "bB" },
      { id: 3, code: "d8", piece: "bQ" },
      { id: 4, code: "e8", piece: "bK" },
      { id: 5, code: "f8", piece: "bB" },
      { id: 6, code: "g8", piece: "bN" },
      { id: 7, code: "h8", piece: "bR" },
    ],
    [
      // 7
      { id: 8, code: "a7", piece: "bP" },
      { id: 9, code: "b7", piece: "bP" },
      { id: 10, code: "c7", piece: "bP" },
      { id: 11, code: "d7", piece: "bP" },
      { id: 12, code: "e7", piece: "bP" },
      { id: 13, code: "f7", piece: "bP" },
      { id: 14, code: "g7", piece: "bP" },
      { id: 15, code: "h7", piece: "bP" },
    ],
    [
      // 6
      { id: 16, code: "a6", piece: "" },
      { id: 17, code: "b6", piece: "" },
      { id: 18, code: "c6", piece: "" },
      { id: 19, code: "d6", piece: "" },
      { id: 20, code: "e6", piece: "" },
      { id: 21, code: "f6", piece: "" },
      { id: 22, code: "g6", piece: "" },
      { id: 23, code: "h6", piece: "" },
    ],
    [
      // 5
      { id: 24, code: "a5", piece: "" },
      { id: 25, code: "b5", piece: "" },
      { id: 26, code: "c5", piece: "" },
      { id: 27, code: "d5", piece: "" },
      { id: 28, code: "e5", piece: "" },
      { id: 29, code: "f5", piece: "" },
      { id: 30, code: "g5", piece: "" },
      { id: 31, code: "h5", piece: "" },
    ],
    [
      // 4
      { id: 32, code: "a4", piece: "" },
      { id: 33, code: "b4", piece: "" },
      { id: 34, code: "c4", piece: "" },
      { id: 35, code: "d4", piece: "" },
      { id: 36, code: "e4", piece: "" },
      { id: 37, code: "f4", piece: "" },
      { id: 38, code: "g4", piece: "" },
      { id: 39, code: "h4", piece: "" },
    ],
    [
      // 3
      { id: 40, code: "a3", piece: "" },
      { id: 41, code: "b3", piece: "" },
      { id: 42, code: "c3", piece: "" },
      { id: 43, code: "d3", piece: "" },
      { id: 44, code: "e3", piece: "" },
      { id: 45, code: "f3", piece: "" },
      { id: 46, code: "g3", piece: "" },
      { id: 47, code: "h3", piece: "" },
    ],
    [
      // 2
      { id: 48, code: "a2", piece: "wP" },
      { id: 49, code: "b2", piece: "wP" },
      { id: 50, code: "c2", piece: "wP" },
      { id: 51, code: "d2", piece: "wP" },
      { id: 52, code: "e2", piece: "wP" },
      { id: 53, code: "f2", piece: "wP" },
      { id: 54, code: "g2", piece: "wP" },
      { id: 55, code: "h2", piece: "wP" },
    ],
    [
      // 1
      { id: 56, code: "a1", piece: "wR" },
      { id: 57, code: "b1", piece: "wN" },
      { id: 58, code: "c1", piece: "wB" },
      { id: 59, code: "d1", piece: "wQ" },
      { id: 60, code: "e1", piece: "wK" },
      { id: 61, code: "f1", piece: "wB" },
      { id: 62, code: "g1", piece: "wN" },
      { id: 63, code: "h1", piece: "wR" },
    ],
  ];

  const [board, setBoard] = useState(defaultBoard);
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);

  const getSquareById = (index: number) => {
    const row = Math.floor(index / 8);
    const rowSquare = index - row * 8;

    return board[row][rowSquare];
  };
  const movePiece = (destination: number) => {
    const movingPiece = getSquareById(selectedSquare!).piece;

    setBoard((prevBoard) =>
      prevBoard.map((row) =>
        row.map((square) => {
          if (square.id === selectedSquare) {
            // remove selected piece
            return { ...square, piece: "" };
          } else if (square.id === destination) {
            // replace piece on destination
            return { ...square, piece: movingPiece };
          } else {
            return square;
          }
        }),
      ),
    );
  };
  const getColor = (id: number) => {
    let row = Math.floor(id / 8);
    let [evenColor, oddColor] =
      row % 2 == 0 ? ["white", "green"] : ["green", "white"];
    let color = id % 2 == 0 ? evenColor : oddColor;

    color = selectedSquare == id ? "yellow" : color;

    return color;
  };
  const handlePieceClick = (index: number) => {
    if (selectedSquare === null) {
      setSelectedSquare(index);
    } else if (index === selectedSquare) {
      setSelectedSquare(null);
    } else if (getSquareById(selectedSquare).piece !== "") {
      movePiece(index);
      setSelectedSquare(null);
    } else {
      setSelectedSquare(null);
    }
  };

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
