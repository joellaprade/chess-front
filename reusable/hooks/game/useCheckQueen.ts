"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import useRefState from "../useRefState";

export const useCheckQueen = () => {
  const { calculatePossibleMoves, getSquareById } = useBoardUtils();
  const { selectedPieceLegalMoves, setSelectedPieceLegalMoves } = useBoardContext();
  const [getOrigin, setOrigin] = useRefState(null);

  const calculateQueen = (origin: number) => {
    const piece = getSquareById(origin).piece;
    const [possibleMoves] = calculatePossibleMoves(origin, piece, true);
    setOrigin(origin);

    return possibleMoves;
  };
  const validateQueen = (destination: number) => {
    const isValid = selectedPieceLegalMoves.includes(destination);
    if (!isValid) return false;

    const piece = getSquareById(getOrigin()).piece;
    const [_, isCheck] = calculatePossibleMoves(destination, piece, false);

    setSelectedPieceLegalMoves([]);
    return true;
  };

  return { calculateQueen, validateQueen };
};
