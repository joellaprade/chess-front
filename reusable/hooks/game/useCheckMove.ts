"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useCheckBishop } from "./useCheckBishop";
import { useCheckRook } from "./useCheckRook";

export const useCheckMove = () => {
  const { getSquareById } = useBoardUtils();
  const { calculateRook, validateRook } = useCheckRook();
  const { calculateBishop, validateBishop } = useCheckBishop();

  const calculateLegalMoves = (origin: number) => {
    const piece = getSquareById(origin).piece.charAt(1);
    let moves: number[] = [];

    switch (piece) {
      case "P":
        break;
      case "R":
        moves = calculateRook(origin);
        break;
      case "N":
        break;
      case "B":
        moves = calculateBishop(origin);
        break;
      case "Q":
        break;
      case "K":
        break;
    }

    return moves;
  };

  const validateMove = (origin: number, destination: number) => {
    let isValid = false;
    const piece = getSquareById(origin).piece.charAt(1);

    switch (piece) {
      case "P":
        isValid = true;
        break;
      case "R":
        isValid = validateRook(destination);
        break;
      case "N":
        isValid = true;
        break;
      case "B":
        isValid = validateBishop(destination);
        break;
      case "Q":
        isValid = true;
        break;
      case "K":
        isValid = true;
        break;
    }

    return isValid;
  };
  const handleWrongMove = () => {};

  return { calculateLegalMoves, validateMove, handleWrongMove };
};
