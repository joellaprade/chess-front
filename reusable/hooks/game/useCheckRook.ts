"use client";

import { useBoardContext } from "@/reusable/context/BoardContext";
import { useBoardUtils } from "./useBoardUtils";

type Direction = "top" | "bottom" | "left" | "right";

export const useCheckRook = () => {
  const { getSquareById } = useBoardUtils();
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
  };

  let isBlocked = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  };

  let possibleMoves: number[] = [];

  const calculatePossibleSquares = (i: number, direction: Direction) => {
    if (isBlocked[direction]) return false;
    const isIndexDecreacing = ["top", "left"].includes(direction);

    let move;
    switch (direction) {
      case "top":
        move = origin - (i + 1) * 8;
        break;
      case "bottom":
        move = origin + (i + 1) * 8;
        break;
      case "left":
        move = origin - (i + 1);
        break;
      case "right":
        move = origin + i + 1;
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

    origin = originParam;
    row = Math.floor(origin / 8);
    col = Math.floor(origin - 8 * row);

    isLimit.top = origin - row * 8;
    isLimit.bottom = origin + (7 - row) * 8;
    isLimit.left = origin - col;
    isLimit.right = origin + (7 - col);

    calculateAllOrientations();

    return possibleMoves;
  };
  const validateRook = (destination: number) => {
    setSelectedPieceLegalMoves([]);
    if (selectedPieceLegalMoves.includes(destination)) return true;
    else return false;
  };

  return { calculateRook, validateRook };
};
