"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import useRefState from "../useRefState";

export const useCheckQueen = () => {
  const { calculatePossibleMoves, getSquareById, checkIsCheckMate } = useBoardUtils();
  const { selectedPieceLegalMoves } = useBoardContext();
  const [getOrigin, setOrigin] = useRefState(null);

  const calculateQueen = (origin: number) => {
    const piece = getSquareById(origin).piece;
    const [possibleMoves] = calculatePossibleMoves(origin, piece, true, false, false);
    setOrigin(origin);

    return possibleMoves;
  };
  const validateQueen = (destination: number) => {
    const isValid = selectedPieceLegalMoves.includes(destination);
    if (!isValid) return false;

    const piece = getSquareById(getOrigin()).piece;
    // hacer debug desde aqui y ver donde ocurre el recur de mier
    const [_, isCheck] = calculatePossibleMoves(destination, piece, false, false, true);
    if (isCheck) checkIsCheckMate(piece);

    return true;
  };

  return { calculateQueen, validateQueen };
};
