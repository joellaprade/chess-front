"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import { Direction } from "@/reusable/types/directions";

export const useCheckKing = () => {
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
    hasWKingMoved,
    hasBKingMoved,
    setSelectedPieceLegalMoves,
  } = useBoardContext();
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
    tl: null,
    tr: null,
    br: null,
    bl: null,
  };

  let possibleMoves: number[] = [];

  const checkIsRowClear = (row: 0 | 7) => {
    let canCastleL = true;
    let canCastleR = true;
    let limits: number[];
    if (row == 7) limits = [57, 60, 61, 63];
    else limits = [1, 4, 5, 7];

    for (let i = limits[0]; i < limits[1]; i++) {
      const piece = getSquareById(i).piece;
      if (piece) canCastleL = false;
    }
    for (let i = limits[2]; i < limits[3]; i++) {
      const piece = getSquareById(i).piece;
      if (piece) canCastleR = false;
    }

    return { canCastleL, canCastleR };
  };
  const calculateCastle = () => {
    if (pieceColor == "w") {
      if (hasWKingMoved.current) return;
      let { canCastleL, canCastleR } = checkIsRowClear(7);

      if (canCastleL) {
        possibleMoves.push(56);
      }
      if (canCastleR) possibleMoves.push(63);
    } else {
      if (hasBKingMoved.current) return;
      let { canCastleL, canCastleR } = checkIsRowClear(0);

      if (canCastleL) possibleMoves.push(0);
      if (canCastleR) possibleMoves.push(7);
    }
  };
  const calculatePossibleSquares = (i: number, direction: Direction) => {
    const isIndexDecreacing = ["tr", "tl", "top", "left"].includes(direction);
    const move = getMoveByDirection(origin, i, direction);
    const limit = isLimit[direction] as number;

    if (isIndexDecreacing && move < limit) return false;
    if (!isIndexDecreacing && move > limit) return false;

    const destinationSquare = getSquareById(move);

    if (destinationSquare.piece.includes(pieceColor)) return false;

    possibleMoves.push(move);
  };
  const calculateAllOrientations = () => {
    const directions: Direction[] = [
      "tr",
      "tl",
      "bl",
      "br",
      "top",
      "bottom",
      "left",
      "right",
    ];

    directions.forEach((direction: Direction) => {
      calculatePossibleSquares(0, direction);
    });
    setSelectedPieceLegalMoves(possibleMoves);
  };
  const calculateKing = (originParam: number) => {
    possibleMoves = [];
    piece = getSquareById(originParam).piece;
    pieceColor = piece.charAt(0);

    origin = originParam;
    ({ row, col } = getRowCol(origin));
    const dLimits = getDiagonals(origin, row, col);
    const pLimits = getPerpendiculars(origin, row, col);
    isLimit = { ...dLimits, ...pLimits };

    calculateAllOrientations();
    calculateCastle();

    return possibleMoves;
  };
  const validateKing = (destination: number) => {
    const pieceColor = getSquareById(selectedSquare!).piece.charAt(0);
    if (pieceColor == "w") hasWKingMoved.current = true;
    if (pieceColor == "b") hasBKingMoved.current = true;

    setSelectedPieceLegalMoves([]);
    if (selectedPieceLegalMoves.includes(destination)) return true;
    else return false;
  };

  return { calculateKing, validateKing };
};
