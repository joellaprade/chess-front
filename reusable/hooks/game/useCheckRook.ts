"use client";

import { useBoardContext } from "@/reusable/context/BoardContext";
import { useBoardUtils } from "./useBoardUtils";
import { PerpendicularDirection } from "@/reusable/types/directions";
import useRefState from "../useRefState";

export const useCheckRook = () => {
  const { getSquareById, getRowCol, getPerpendiculars, getMoveByDirection } =
    useBoardUtils();
  const {
    selectedPieceLegalMoves,
    setSelectedPieceLegalMoves,
    getHasRookMove,
    setHasRookMove,
  } = useBoardContext();

  const [getPieceColor, setPieceColor] = useRefState("");
  const [getOrigin, setOrigin] = useRefState(NaN);

  let piece: string;

  let row: number;
  let col: number;

  let isLimit: Record<PerpendicularDirection, number | null> = {
    top: null,
    bottom: null,
    left: null,
    right: null,
  };

  let isBlocked = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  };

  let possibleMoves: number[] = [];

  const checkHasMoved = () => {
    const isWhite = getPieceColor() === "w";
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
  const calculatePossibleSquares = (
    i: number,
    direction: PerpendicularDirection,
  ) => {
    if (isBlocked[direction]) return false;
    const isIndexDecreacing = ["top", "left"].includes(direction);
    let move = getMoveByDirection(getOrigin(), i, direction);
    let limit = isLimit[direction] as number;

    if (isIndexDecreacing && move < limit) return false;
    if (!isIndexDecreacing && move > limit) return false;

    const destinationSquare = getSquareById(move);

    if (destinationSquare.piece != "") {
      isBlocked[direction] = true;
      if (destinationSquare.piece.includes(getPieceColor())) return false;
    }

    possibleMoves.push(move);
  };
  const calculateAllOrientations = () => {
    for (let i = 0; i < 7; i++) {
      calculatePossibleSquares(i, "top");
      calculatePossibleSquares(i, "bottom");
      calculatePossibleSquares(i, "left");
      calculatePossibleSquares(i, "right");
    }
    setSelectedPieceLegalMoves(possibleMoves);
  };
  const calculateRook = (originParam: number) => {
    possibleMoves = [];
    piece = getSquareById(originParam).piece;
    setPieceColor(piece.charAt(0));

    setOrigin(originParam);
    [row, col] = getRowCol(getOrigin());
    isLimit = getPerpendiculars(getOrigin(), row, col);

    calculateAllOrientations();

    return possibleMoves;
  };
  const validateRook = (destination: number) => {
    setSelectedPieceLegalMoves([]);
    const isValid = selectedPieceLegalMoves.includes(destination);
    if (!isValid) return false;

    checkHasMoved();

    return true;
  };

  return { calculateRook, validateRook };
};
