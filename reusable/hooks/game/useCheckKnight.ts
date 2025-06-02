"use client";

import useRefState from "../useRefState";
import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";

export const useCheckKnight = () => {
  const { getSquareById, calculatePossibleMoves } = useBoardUtils();
  const { selectedPieceLegalMoves } = useBoardContext();
  const [getOrigin, setOrigin] = useRefState(null);

  const calculateKnight = (origin: number) => {
    const piece = getSquareById(origin).piece;
    const [possibleMoves] = calculatePossibleMoves(origin, piece, true, false, false);
    setOrigin(origin);
    return possibleMoves;
  };
  const validateKnight = (destination: number) => {
    const isValid = selectedPieceLegalMoves.current.includes(destination);
    if (!isValid) return false;

    const piece = getSquareById(getOrigin()).piece;
    const [_, isCheck] = calculatePossibleMoves(destination, piece, false, false, true);

    return true;
  };

  return { calculateKnight, validateKnight };
};
