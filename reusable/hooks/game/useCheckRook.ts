"use client";

import { useBoardContext } from "@/reusable/context/BoardContext";
import { useBoardUtils } from "./useBoardUtils";
import useRefState from "../useRefState";

export const useCheckRook = () => {
  const { getSquareById, calculatePossibleMoves } = useBoardUtils();
  const { selectedPieceLegalMoves, setSelectedPieceLegalMoves, getHasRookMove, setHasRookMove } =
    useBoardContext();

  const [getOrigin, setOrigin] = useRefState(NaN);

  const checkHasMoved = (piece: string) => {
    const isWhite = piece.charAt(0) === "w";
    const hasRookMove = getHasRookMove();

    if (isWhite) {
      if (hasRookMove.hasWhiteMoved) return;

      if (getOrigin() == 56) {
        setHasRookMove(true, "white.left");
      }
      if (getOrigin() == 63) {
        setHasRookMove(true, "white.right");
      }
    } else {
      if (hasRookMove.hasBlackMoved) return;

      if (getOrigin() == 0) {
        setHasRookMove(true, "black.left");
      }
      if (getOrigin() == 7) {
        setHasRookMove(true, "black.right");
      }
    }
  };
  const calculateRook = (origin: number) => {
    const piece = getSquareById(origin).piece;
    const [possibleMoves] = calculatePossibleMoves(origin, piece, true, false, false);
    setOrigin(origin);

    return possibleMoves;
  };
  const validateRook = (destination: number) => {
    const isValid = selectedPieceLegalMoves.includes(destination);
    if (!isValid) return false;

    const piece = getSquareById(getOrigin()).piece;
    const [_, isCheck] = calculatePossibleMoves(destination, piece, false, false, true);

    setSelectedPieceLegalMoves([]);
    checkHasMoved(piece);
    return true;
  };

  return { calculateRook, validateRook };
};
