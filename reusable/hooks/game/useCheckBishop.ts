"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import { DiagonalDirection } from "@/reusable/types/directions";

export const useCheckBishop = () => {
  const { getSquareById, getRowCol, getDiagonals, getMoveByDirection } =
    useBoardUtils();
  const { selectedPieceLegalMoves, setSelectedPieceLegalMoves } =
    useBoardContext();
  let piece: string;
  let pieceColor: string;

  let origin: number;
  let row: number;
  let col: number;

  let isLimit: Record<DiagonalDirection, number | null> = {
    tl: null,
    tr: null,
    br: null,
    bl: null,
  };

  let isBlocked = {
    tl: false,
    tr: false,
    br: false,
    bl: false,
  };

  let possibleMoves: number[] = [];

  const calculatePossibleSquares = (
    i: number,
    direction: DiagonalDirection,
  ) => {
    if (isBlocked[direction]) return false;
    const isIndexDecreacing = ["tr", "tl"].includes(direction);
    const move = getMoveByDirection(origin, i, direction);
    const limit = isLimit[direction] as number;

    if (isIndexDecreacing && move < limit) return false;
    if (!isIndexDecreacing && move > limit) return false;

    const destinationSquare = getSquareById(move);

    console.log(destinationSquare.piece);
    if (destinationSquare.piece != "") {
      console.log(destinationSquare.piece);
      isBlocked[direction] = true;
      if (destinationSquare.piece.includes(pieceColor)) return false;
    }

    possibleMoves.push(move);
  };
  const calculateAllOrientations = () => {
    for (let i = 0; i < 7; i++) {
      calculatePossibleSquares(i, "tr");
      calculatePossibleSquares(i, "tl");
      calculatePossibleSquares(i, "bl");
      calculatePossibleSquares(i, "br");
    }
    setSelectedPieceLegalMoves(possibleMoves);
  };
  const calculateBishop = (originParam: number) => {
    possibleMoves = [];
    piece = getSquareById(originParam).piece;
    pieceColor = piece.charAt(0);

    origin = originParam;
    [row, col] = getRowCol(origin);
    isLimit = getDiagonals(origin, row, col);

    calculateAllOrientations();

    return possibleMoves;
  };
  const validateBishop = (destination: number) => {
    setSelectedPieceLegalMoves([]);
    if (selectedPieceLegalMoves.includes(destination)) return true;
    else return false;
  };

  return { calculateBishop, validateBishop };
};
/*
// 7: 7 (7, 7)
// 5: 5 (7, 5)
// 14: 6 (6, 6)
// 23: 5 (5, 7)

// 56: 0 (0, 0)
// 40: 0 (1, 0)
// 49: 1 (1, 1)
// 58: 0 (0, 2)

// bajo diagonal, superior derecha
7 - Math.min(row, col);
//sobre diagonal, superior derecha
Math.max(row, col);

//bajo diagonal, abajo izquierda
7 - Math.max(row, col);
// sobre diagonal, abajo izquierda
Math.min(row, col);

isLimit.bl = origin + 7 * (7 - Math.min(row, col));
isLimit.bl = origin + 7 * Math.max(row, col);
isLimit.bl = origin + 7 * (7 - Math.max(row, col));
isLimit.bl = origin + 7 * Math.min(row, col);

// isLimit.tr = (origin + 7 - 2 * col - 9 * Math.min(row, 7 - col)) + 7 - 2 * col;
// isLimit.tr = 37 - 9 * Math.min(row, col);
*/
