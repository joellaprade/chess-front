"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";

type Direction = "tl" | "tr" | "bl" | "br";

export const useCheckBishop = () => {
  const { getSquareById } = useBoardUtils();
  const { selectedPieceLegalMoves, setSelectedPieceLegalMoves } =
    useBoardContext();
  let piece: string;
  let pieceColor: string;

  let origin: number;
  let row: number;
  let col: number;

  let isLimit: Record<Direction, number | null> = {
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

  const calculatePossibleSquares = (i: number, direction: Direction) => {
    if (isBlocked[direction]) return false;
    const isIndexDecreacing = ["tr", "tl"].includes(direction);

    let move;
    switch (direction) {
      case "tr":
        move = origin - (i + 1) * 7;
        break;
      case "tl":
        move = origin - (i + 1) * 9;
        break;
      case "bl":
        move = origin + (i + 1) * 7;
        break;
      case "br":
        move = origin + (i + 1) * 9;
        break;
    }

    let limit = isLimit[direction] as number;

    if (isIndexDecreacing && move < limit) return false;
    if (!isIndexDecreacing && move > limit) return false;

    let destinationSquare = getSquareById(move);
    if (destinationSquare.piece != "") {
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
    row = Math.floor(origin / 8);
    col = Math.floor(origin - 8 * row);

    isLimit.tl = origin - 9 * Math.min(row, col);
    isLimit.bl = origin + 7 * Math.min(7 - row, col);
    isLimit.tr = origin - 7 * Math.min(row, 7 - col);
    isLimit.br = origin + 9 * (7 - Math.max(row, col));

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
