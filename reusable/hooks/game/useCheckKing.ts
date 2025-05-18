"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import { Direction } from "@/reusable/types/directions";
import useRefState from "../useRefState";

export const useCheckKing = () => {
  const {
    getSquareById,
    getRowCol,
    getDiagonals,
    getPerpendiculars,
    getMoveByDirection,
  } = useBoardUtils();
  const {
    selectedPieceLegalMoves,
    setSelectedPieceLegalMoves,
    getHasRookMove,
  } = useBoardContext();

  const [getHasKingMoved, setHasKingMoved] = useRefState({
    white: false,
    black: false,
  });

  const [getPieceColor, setPieceColor] = useRefState("");

  let piece: string;

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

  const checkHasMoved = () => {
    if (!getHasKingMoved().white && getPieceColor() == "w") {
      setHasKingMoved(true, "white");
    }
    if (!getHasKingMoved().black && getPieceColor() == "b") {
      setHasKingMoved(true, "black");
    }
  };
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
    if (getPieceColor() == "w") {
      if (getHasKingMoved().white) return;
      let { canCastleL, canCastleR } = checkIsRowClear(7);

      if (canCastleL && !getHasRookMove().white.left) possibleMoves.push(56);
      if (canCastleR && !getHasRookMove().white.right) possibleMoves.push(63);
    } else {
      if (getHasKingMoved().black) return;
      let { canCastleL, canCastleR } = checkIsRowClear(0);

      if (canCastleL && !getHasRookMove().black.left) possibleMoves.push(0);
      if (canCastleR && !getHasRookMove().black.right) possibleMoves.push(7);
    }
  };
  const calculatePossibleSquares = (i: number, direction: Direction) => {
    const isIndexDecreacing = ["tr", "tl", "top", "left"].includes(direction);
    const move = getMoveByDirection(origin, i, direction);
    const limit = isLimit[direction] as number;

    if (isIndexDecreacing && move < limit) return false;
    if (!isIndexDecreacing && move > limit) return false;

    const destinationSquare = getSquareById(move);

    if (destinationSquare.piece.includes(getPieceColor())) return false;

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
    setPieceColor(piece.charAt(0));

    origin = originParam;
    [row, col] = getRowCol(origin);
    const dLimits = getDiagonals(origin, row, col);
    const pLimits = getPerpendiculars(origin, row, col);
    isLimit = { ...dLimits, ...pLimits };

    calculateAllOrientations();
    calculateCastle();

    return possibleMoves;
  };
  const validateKing = (destination: number) => {
    checkHasMoved();
    setSelectedPieceLegalMoves([]);
    if (selectedPieceLegalMoves.includes(destination)) return true;
    else return false;
  };

  return { calculateKing, validateKing };
};
