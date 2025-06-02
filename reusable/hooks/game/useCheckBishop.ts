"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import useRefState from "../useRefState";

export const useCheckBishop = () => {
  const { calculatePossibleMoves, getSquareById } = useBoardUtils();
  const { selectedPieceLegalMoves } = useBoardContext();

  const [getOrigin, setOrigin] = useRefState(null);

  const calculateBishop = (origin: number) => {
    const piece = getSquareById(origin).piece;
    const [possibleMoves] = calculatePossibleMoves(origin, piece, true, false, false);
    setOrigin(origin);

    return possibleMoves;
  };
  const validateBishop = (destination: number) => {
    const isValid = selectedPieceLegalMoves.includes(destination);
    if (!isValid) return false;

    const piece = getSquareById(getOrigin()).piece;
    const [_, isCheck] = calculatePossibleMoves(destination, piece, false, false, true);

    return true;
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
