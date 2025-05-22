"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import { Direction } from "@/reusable/types/directions";
import useRefState from "../useRefState";

export const useCheckQueen = () => {
  const {
    getSquareById,
    getRowCol,
    getDiagonals,
    getPerpendiculars,
    getMoveByDirection,
    checkIsCheck,
  } = useBoardUtils();
  const { selectedPieceLegalMoves, setSelectedPieceLegalMoves } =
    useBoardContext();
  const [getPiece, setPiece] = useRefState(null);
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

  let isBlocked = {
    top: false,
    bottom: false,
    left: false,
    right: false,
    tl: false,
    tr: false,
    br: false,
    bl: false,
  };

  let possibleMoves: number[] = [];

  const evaluateSquare = (i: number, direction: Direction) => {
    if (isBlocked[direction]) return false;
    const isIndexDecreacing = ["tr", "tl", "top", "left"].includes(direction);
    const move = getMoveByDirection(origin, i, direction);
    const limit = isLimit[direction] as number;

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
      evaluateSquare(i, "tr");
      evaluateSquare(i, "tl");
      evaluateSquare(i, "bl");
      evaluateSquare(i, "br");

      evaluateSquare(i, "top");
      evaluateSquare(i, "bottom");
      evaluateSquare(i, "left");
      evaluateSquare(i, "right");
    }
    setSelectedPieceLegalMoves(possibleMoves);
  };
  const calculateQueen = (originParam: number) => {
    possibleMoves = [];
    setPiece(getSquareById(originParam).piece);
    pieceColor = getPiece().charAt(0);

    origin = originParam;
    [row, col] = getRowCol(origin);
    const dLimits = getDiagonals(origin, row, col);
    const pLimits = getPerpendiculars(origin, row, col);
    isLimit = { ...dLimits, ...pLimits };

    calculateAllOrientations();

    return possibleMoves;
  };
  const validateQueen = (destination: number) => {
    const isCheck = checkIsCheck(getPiece(), destination);
    console.log(isCheck);
    setSelectedPieceLegalMoves([]);
    if (selectedPieceLegalMoves.includes(destination)) return true;
    else return false;
  };

  return { calculateQueen, validateQueen };
};
