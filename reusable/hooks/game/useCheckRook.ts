"use client";

import { useBoardContext } from "@/reusable/context/BoardContext";
import { useBoardUtils } from "./useBoardUtils";
import { PerpendicularDirection } from "@/reusable/types/directions";
import { useRef } from "react";

export const useCheckRook = () => {
  const { getSquareById, getRowCol, getPerpendiculars, getMoveByDirection } =
    useBoardUtils();
  const {
    selectedPieceLegalMoves,
    setSelectedPieceLegalMoves,
    hasRookMoveRef,
  } = useBoardContext();

  const pieceColorRef = useRef<string>("");
  const originRef = useRef<number>(NaN);

  let pieceColor = pieceColorRef.current;
  let origin = originRef.current;
  let hasRookMove = hasRookMoveRef.current;

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
    const isWhite = pieceColor === "w";

    if (isWhite) {
      if (hasRookMove.hasWhiteMoved) return;

      if (origin == 56) {
        hasRookMove.white.left = true;
        hasRookMoveRef.current = hasRookMove;
      }
      if (origin == 63) {
        hasRookMove.white.right = true;
        hasRookMoveRef.current = hasRookMove;
      }
    } else {
      if (hasRookMove.hasBlackMoved) return;

      if (origin == 0) {
        hasRookMove.black.left = true;
        hasRookMoveRef.current = hasRookMove;
      }
      if (origin == 7) {
        hasRookMove.black.right = true;
        hasRookMoveRef.current = hasRookMove;
      }
    }
  };
  const calculatePossibleSquares = (
    i: number,
    direction: PerpendicularDirection,
  ) => {
    if (isBlocked[direction]) return false;
    const isIndexDecreacing = ["top", "left"].includes(direction);
    let move = getMoveByDirection(origin, i, direction);
    let limit = isLimit[direction] as number;

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
    pieceColor = piece.charAt(0);
    pieceColorRef.current = pieceColor;

    origin = originParam;
    originRef.current = origin;
    ({ row, col } = getRowCol(origin));
    isLimit = getPerpendiculars(origin, row, col);

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

  return { hasRookMoveRef, calculateRook, validateRook };
};
