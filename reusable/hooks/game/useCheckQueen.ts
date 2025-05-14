"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import { Direction } from "@/reusable/types/directions";

export const useCheckQueen = () => {
  const {
    getSquareById,
    getRowCol,
    getDiagonals,
    getPerpendiculars,
    getMoveByDirection,
  } = useBoardUtils();
  const { selectedPieceLegalMoves, setSelectedPieceLegalMoves } =
    useBoardContext();
  let piece: string;
  let pieceColor: string;

  let origin: number;
  let row: number;
  let col: number;

  let isLimit: Record<Direction, number | null> = {
    top: null,
    bottom: null,
    left: null,
    right: null,
    tl: null,
    tr: null,
    br: null,
    bl: null,
  };

  let isBlocked = {
    top: false,
    bottom: false,
    left: false,
    right: false,
    tl: false,
    tr: false,
    br: false,
    bl: false,
  };

  let possibleMoves: number[] = [];

  const calculatePossibleSquares = (i: number, direction: Direction) => {
    if (isBlocked[direction]) return false;
    const isIndexDecreacing = ["tr", "tl", "top", "left"].includes(direction);
    const move = getMoveByDirection(origin, i, direction);
    const limit = isLimit[direction] as number;

    if (isIndexDecreacing && move < limit) return false;
    if (!isIndexDecreacing && move > limit) return false;

    const destinationSquare = getSquareById(move);

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

      calculatePossibleSquares(i, "top");
      calculatePossibleSquares(i, "bottom");
      calculatePossibleSquares(i, "left");
      calculatePossibleSquares(i, "right");
    }
    setSelectedPieceLegalMoves(possibleMoves);
  };
  const calculateQueen = (originParam: number) => {
    possibleMoves = [];
    piece = getSquareById(originParam).piece;
    pieceColor = piece.charAt(0);

    origin = originParam;
    ({ row, col } = getRowCol(origin));
    const dLimits = getDiagonals(origin, row, col);
    const pLimits = getPerpendiculars(origin, row, col);
    isLimit = { ...dLimits, ...pLimits };

    calculateAllOrientations();

    return possibleMoves;
  };
  const validateQueen = (destination: number) => {
    setSelectedPieceLegalMoves([]);
    if (selectedPieceLegalMoves.includes(destination)) return true;
    else return false;
  };

  return { calculateQueen, validateQueen };
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
