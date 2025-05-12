"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";

type Direction = "tl" | "tr" | "bl" | "br";

export const useCheckKnight = () => {
  const { getSquareById } = useBoardUtils();
  const { selectedPieceLegalMoves, setSelectedPieceLegalMoves } =
    useBoardContext();
  let piece: string;
  let pieceColor: string;

  let origin: number;
  let oFile: number;
  let oCol: number;

  let isLimit: Record<Direction, number | null> = {
    tl: null,
    tr: null,
    br: null,
    bl: null,
  };

  let isBlocked = {
    tl: false,
    tr: false,
    br: false,
    bl: false,
  };

  let possibleMoves: number[] = [];

  const calculateMoves = (i: number, direction: Direction) => {
    if (isBlocked[direction]) return false;
    const isIndexDecreacing = ["tr", "tl"].includes(direction);

    let move;
    switch (direction) {
      case "tr":
        move = origin - (i + 1) * 7;
        break;
      case "tl":
        move = origin - (i + 1) * 9;
        break;
      case "bl":
        move = origin + (i + 1) * 7;
        break;
      case "br":
        move = origin + (i + 1) * 9;
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
  const calculatePossibleSquares = () => {
    for (let i = 0; i < 7; i++) {
      calculateMoves(i, "tr");
      calculateMoves(i, "tl");
      calculateMoves(i, "bl");
      calculateMoves(i, "br");
    }
    setSelectedPieceLegalMoves(possibleMoves);
  };
  const calculateKnight = (originParam: number) => {
    possibleMoves = [];
    piece = getSquareById(originParam).piece;
    pieceColor = piece.charAt(0);

    origin = originParam;
    oFile = Math.floor(origin / 8);
    oCol = Math.floor(origin - 8 * oFile);

    isLimit.tl = origin - 9 * Math.min(oFile, oCol);
    isLimit.bl = origin + 7 * Math.min(7 - oFile, oCol);
    isLimit.tr = origin - 7 * Math.min(oFile, 7 - oCol);
    isLimit.br = origin + 9 * (7 - Math.max(oFile, oCol));

    calculatePossibleSquares();

    return possibleMoves;
  };
  const validateKnight = (destination: number) => {
    setSelectedPieceLegalMoves([]);
    if (selectedPieceLegalMoves.includes(destination)) return true;
    else return false;
  };

  return { calculateKnight, validateKnight };
};
