"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import { Direction } from "@/reusable/types/directions";

export const useCheckPawn = () => {
  const {
    getSquareById,
    getRowCol,
    getDiagonals,
    getPerpendiculars,
    getMoveByDirection,
  } = useBoardUtils();
  const {
    selectedSquare,
    selectedPieceLegalMoves,
    setShowQueenPopup,
    setSelectedPieceLegalMoves,
    setUpgradingPawn,
  } = useBoardContext();
  let piece: string;
  let pieceColor: string;

  let destination: number;
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

  let possibleMoves: number[] = [];

  const calculateIsQueen = () => {
    if (
      [0, 1, 2, 3, 4, 5, 6, 7].includes(destination) ||
      [56, 57, 58, 59, 60, 61, 62, 63].includes(destination)
    ) {
      setUpgradingPawn(destination);
      setShowQueenPopup(true);
    }
  };
  const calculatePossibleSquares = (i: number, direction: Direction) => {
    const isIndexDecreacing = ["tr", "tl", "top"].includes(direction);
    const move = getMoveByDirection(origin, i, direction);
    const limit = isLimit[direction] as number;

    if (isIndexDecreacing && move < limit) return false;
    if (!isIndexDecreacing && move > limit) return false;

    const destinationSquare = getSquareById(move);
    if (
      ["tr", "tl", "br", "bl"].includes(direction) &&
      destinationSquare.piece == ""
    )
      return false;

    if (["top", "bottom"].includes(direction) && destinationSquare.piece != "")
      return false;

    if (destinationSquare.piece.includes(pieceColor)) return false;

    possibleMoves.push(move);
  };
  const calculateAllOrientations = () => {
    const isWhite = pieceColor == "w";
    const directions: Direction[] = isWhite
      ? ["tr", "tl", "top"]
      : ["br", "bl", "bottom"];

    directions.forEach((direction: Direction) => {
      calculatePossibleSquares(0, direction);
    });

    if (isWhite && [48, 49, 50, 51, 52, 53, 54, 55].includes(origin)) {
      calculatePossibleSquares(1, "top");
    }
    if (!isWhite && [8, 9, 10, 11, 12, 13, 14, 15].includes(origin)) {
      calculatePossibleSquares(1, "bottom");
    }

    setSelectedPieceLegalMoves(possibleMoves);
  };
  const calculatePawn = (originParam: number) => {
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
  const validatePawn = (destinationL: number) => {
    piece = getSquareById(selectedSquare!).piece;
    pieceColor = piece.charAt(0);
    destination = destinationL;
    calculateIsQueen();
    setSelectedPieceLegalMoves([]);
    if (selectedPieceLegalMoves.includes(destinationL)) return true;
    else return false;
  };

  return { calculatePawn, validatePawn };
};
