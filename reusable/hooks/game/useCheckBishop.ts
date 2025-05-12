"use client";

import { useBoardUtils } from "./useBoardUtils";

type Direction = "tl" | "tr" | "bl" | "br";

export const useCheckBishop = () => {
  const { getSquareById } = useBoardUtils();
  let piece: string;
  let pieceColor: string;

  let origin: number;
  let oFile: number;
  let oCol: number;

  let destination: number;

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
    const isTopLeft = ["top", "left"].includes(direction);

    let move;
    switch (direction) {
      case "tr":
        move = origin - (i + 1) * 8;
        break;
      case "tl":
        move = origin + (i + 1) * 8;
        break;
      case "bl":
        move = origin - (i + 1);
        break;
      case "br":
        move = origin + i + 1;
        break;
    }

    let limit = isLimit[direction] as number;

    if (isTopLeft && move < limit) return false;
    if (!isTopLeft && move > limit) return false;

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
  };
  const checkBishop = (originParam: number, destinationParam: number) => {
    piece = getSquareById(originParam).piece;
    pieceColor = piece.charAt(0);

    origin = originParam;
    oFile = Math.floor(origin / 8);
    oCol = Math.floor(origin - 8 * oFile);
    destination = destinationParam;

    isLimit.tr = origin - 7 * Math.min(oFile, 7 - oCol);
    isLimit.bl = origin + 7 * Math.min(7 - oFile, oCol);
    isLimit.tl = origin - 9 * Math.min(oFile, oCol);
    isLimit.br = origin + 9 * (7 - Math.max(oFile, oCol));

    possibleMoves = [];
    calculatePossibleSquares();

    if (possibleMoves.includes(destination)) return true;
  };

  return { checkBishop };
};
/*
// 7: 7 (7, 7)
// 5: 5 (7, 5)
// 14: 6 (6, 6)
// 23: 5 (5, 7)

// 56: 0 (0, 0)
// 40: 0 (1, 0)
// 49: 1 (1, 1)
// 58: 0 (0, 2)

// bajo diagonal, superior derecha
7 - Math.min(oFile, oCol);
//sobre diagonal, superior derecha
Math.max(oFile, oCol);

//bajo diagonal, abajo izquierda
7 - Math.max(oFile, oCol);
// sobre diagonal, abajo izquierda
Math.min(oFile, oCol);

isLimit.bl = origin + 7 * (7 - Math.min(oFile, oCol));
isLimit.bl = origin + 7 * Math.max(oFile, oCol);
isLimit.bl = origin + 7 * (7 - Math.max(oFile, oCol));
isLimit.bl = origin + 7 * Math.min(oFile, oCol);

// isLimit.tr = (origin + 7 - 2 * oCol - 9 * Math.min(oFile, 7 - oCol)) + 7 - 2 * oCol;
// isLimit.tr = 37 - 9 * Math.min(oFile, oCol);
*/
