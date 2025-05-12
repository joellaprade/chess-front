"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";

type Direction = "tl" | "tr" | "bl" | "br";

export const useCheckKnight = () => {
  const { getSquareById } = useBoardUtils();
  const { selectedPieceLegalMoves, setSelectedPieceLegalMoves } =
    useBoardContext();
  let piece: string;
  let pieceColor: string;

  let origin: number;
  let row: number;
  let col: number;

  let possibleMoves: number[] = [];

  const calculatePossibleSquares = () => {
    const moves = [
      [origin - 17, origin - 15],
      [origin - 10, origin - 6],
      [origin + 6, origin + 10],
      [origin + 15, origin + 17],
    ];

    // Calcular cuales estan fuera del tablero
    for (let i = 0; i < 4; i++) {
      const [moveA, moveB] = moves[i];
      if (col < 1 || row < 2) {
        //eliminar square
      }
    }

    let destinationSquare = getSquareById(1);
    if (destinationSquare.piece != "") {
      if (destinationSquare.piece.includes(pieceColor)) return false;
    }

    possibleMoves = [...moves[0], ...moves[1], ...moves[2], ...moves[3]];
  };
  const calculateKnight = (originParam: number) => {
    possibleMoves = [];
    piece = getSquareById(originParam).piece;
    pieceColor = piece.charAt(0);

    origin = originParam;
    row = Math.floor(origin / 8);
    col = Math.floor(origin - 8 * row);

    calculatePossibleSquares();

    return possibleMoves;
  };
  const validateKnight = (destination: number) => {
    setSelectedPieceLegalMoves([]);
    if (selectedPieceLegalMoves.includes(destination)) return true;
    else return false;
  };

  return { calculateKnight, validateKnight };
};
