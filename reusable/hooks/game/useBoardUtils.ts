"use client";

import { useBoardContext } from "../../context/BoardContext";
import { DiagonalDirection, Direction } from "@/reusable/types/directions";
import { PerpendicularDirection } from "@/reusable/types/directions";

export const useBoardUtils = () => {
  const { board, setSelectedPieceLegalMoves } = useBoardContext();

  const getSquareById = (index: number) => {
    const row = Math.floor(index / 8);
    const rowSquare = index - row * 8;

    return board[row][rowSquare];
  };
  const getRowCol = (origin: number): [number, number] => {
    const row = Math.floor(origin / 8);
    const col = origin - 8 * row;

    return [row, col];
  };
  const getDiagonals = (origin: number, row: number, col: number) => {
    let isLimit: Record<DiagonalDirection, number> = {
      tl: origin - 9 * Math.min(row, col),
      bl: origin + 7 * Math.min(7 - row, col),
      tr: origin - 7 * Math.min(row, 7 - col),
      br: origin + 9 * (7 - Math.max(row, col)),
    };
    return isLimit;
  };
  const getPerpendiculars = (origin: number, row: number, col: number) => {
    let isLimit: Record<PerpendicularDirection, number> = {
      top: origin - row * 8,
      bottom: origin + (7 - row) * 8,
      left: origin - col,
      right: origin + (7 - col),
    };
    return isLimit;
  };
  const getLimits = (origin: number, piece: string) => {
    const [row, col] = getRowCol(origin);
    let limit: Record<any, number> = {};
    switch (piece.charAt(1)) {
      case "R":
        limit = getPerpendiculars(origin, row, col);
        break;
      case "B":
        limit = getDiagonals(origin, row, col);
        break;
      case "Q":
        limit = {
          ...getPerpendiculars(origin, row, col),
          ...getDiagonals(origin, row, col),
        };
        break;
    }

    return limit;
  };
  const getMoveByDirection = (
    origin: number,
    i: number,
    direction: DiagonalDirection | PerpendicularDirection,
  ) => {
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
      default:
        move = 64;
    }

    return move;
  };
  const getDirectionByPiece = (piece: string) => {
    const pDirections: PerpendicularDirection[] = [
      "top",
      "bottom",
      "left",
      "right",
    ];
    const dDirections: DiagonalDirection[] = ["bl", "br", "tl", "tr"];
    const allDirections: Direction[] = [...pDirections, ...dDirections];
    let directions: Direction[] = [];
    switch (piece.charAt(1)) {
      case "R":
        directions = pDirections as Direction[];
        break;
      case "B":
        directions = dDirections as Direction[];
        break;
      case "Q":
        directions = allDirections;
        break;
    }

    return directions;
  };
  const evaluateRBQ = (piece: string, origin: number) => {
    const diagonalDirections: DiagonalDirection[] = ["bl", "br", "tl", "tr"];
    const perpendicularDirection: PerpendicularDirection[] = [
      "top",
      "bottom",
      "left",
      "right",
    ];
    const [row, col] = getRowCol(origin);
    const dLimits = getDiagonals(origin, row, col);
    const pLimits = getPerpendiculars(origin, row, col);
    const isLimit = { ...dLimits, ...pLimits };

    let possibleMoves = [];
    let isBlocked: Record<string, boolean> = {
      top: false,
      bottom: false,
      left: false,
      right: false,
      tl: false,
      tr: false,
      br: false,
      bl: false,
    };
    let directions: Direction[] = [];
    let isCheck = false;

    switch (piece.charAt(1)) {
      case "R":
        directions = perpendicularDirection as Direction[];
        break;
      case "B":
        directions = diagonalDirections as Direction[];
        break;
      case "Q":
        directions = [...perpendicularDirection, ...diagonalDirections];
        break;
    }

    for (let i = 0; i < 7; i++) {
      directions.forEach((direction) => {
        if (isBlocked[direction]) return false;
        const isIndexDecreacing = ["tr", "tl", "top", "left"].includes(
          direction,
        );
        const move = getMoveByDirection(origin, i, direction);
        const limit = isLimit[direction] as number;

        if (isIndexDecreacing && move < limit) return false;
        if (!isIndexDecreacing && move > limit) return false;

        const destSquarePiece = getSquareById(move).piece;
        const originPieceColor = piece.charAt(0);

        if (destSquarePiece != "" && destSquarePiece != piece) {
          isBlocked[direction] = true;
          if (destSquarePiece.includes(originPieceColor)) return false;
        }

        if (destSquarePiece.includes("K")) isCheck = true;

        possibleMoves.push(move);
      });
    }
    return isCheck;
  };
  const evaluateKnight = (piece: string, origin: number) => {
    console.log("ramn");
  };
  const evaluatePawn = (piece: string, origin: number) => {};
  const checkIsCheck = (piece: string, origin: number) => {
    switch (piece.charAt(1)) {
      case "R":
        evaluateRBQ(piece, origin);
        break;
      case "B":
        evaluateRBQ(piece, origin);
        break;
      case "Q":
        evaluateRBQ(piece, origin);
        break;
      case "N":
        evaluateKnight(piece, origin);
        break;
      case "P":
        evaluatePawn(piece, origin);
        break;
    }
  };
  const calculateIncrementalPiece = (origin: number) => {
    let possibleMoves: number[] = [];
    const piece = getSquareById(origin).piece;
    const directions = getDirectionByPiece(piece);
    const isLimit = getLimits(origin, piece);
    let isBlocked: Record<string, boolean> = {
      top: false,
      bottom: false,
      left: false,
      right: false,
      tl: false,
      tr: false,
      br: false,
      bl: false,
    };

    for (let i = 0; i < 7; i++) {
      directions.forEach((direction) => {
        if (isBlocked[direction]) return false;
        const isIndexDecreacing = ["tr", "tl", "top", "left"].includes(
          direction,
        );
        let move = getMoveByDirection(origin, i, direction);
        let limit = isLimit[direction] as number;

        if (isIndexDecreacing && move < limit) return false;
        if (!isIndexDecreacing && move > limit) return false;

        const destinationSquare = getSquareById(move);

        if (destinationSquare.piece != "") {
          isBlocked[direction] = true;
          if (destinationSquare.piece.includes(piece.charAt(0))) return false;
        }

        possibleMoves.push(move);
      });
    }
    setSelectedPieceLegalMoves(possibleMoves);
    return possibleMoves;
  };

  return {
    getSquareById,
    getRowCol,
    getPerpendiculars,
    getDiagonals,
    getMoveByDirection,
    checkIsCheck,
  };
};
