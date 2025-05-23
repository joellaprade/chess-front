"use client";

import { useBoardContext } from "../../context/BoardContext";
import { DiagonalDirection, Direction } from "@/reusable/types/directions";
import { PerpendicularDirection } from "@/reusable/types/directions";
import { EvalSquareParam } from "@/reusable/types/evalSquareParamType";

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
      case "K":
        limit = {
          ...getPerpendiculars(origin, row, col),
          ...getDiagonals(origin, row, col),
        };
        break;
      case "P":
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
      case "K":
        directions = allDirections;
        break;
      case "P":
        directions =
          piece.charAt(0) === "w"
            ? ["tr", "tl", "top"]
            : ["br", "bl", "bottom"];
        break;
    }

    return directions;
  };
  const evaluateSquare = ({
    isBlocked,
    direction,
    origin,
    i,
    isLimit,
    piece,
    isCheck,
    possibleMoves,
    extras,
  }: EvalSquareParam) => {
    if (isBlocked[direction]) return false;
    const isIndexDecreacing = ["tr", "tl", "top", "left"].includes(direction);
    let move = getMoveByDirection(origin, i, direction);
    let limit = isLimit[direction] as number;

    if (isIndexDecreacing && move < limit) return false;
    if (!isIndexDecreacing && move > limit) return false;

    const destinationSquare = getSquareById(move);

    if (destinationSquare.piece != "" && destinationSquare.piece != piece) {
      isBlocked[direction] = true;
    }
    if (destinationSquare.piece.includes(piece.charAt(0))) return false;
    if (piece.charAt(1) === "P") {
      if (
        ["top", "bottom"].includes(direction) &&
        destinationSquare.piece != ""
      )
        return false;
      if (
        (direction != extras?.direction || origin != extras?.origin) &&
        ["tr", "tl", "br", "bl"].includes(direction) &&
        destinationSquare.piece == ""
      )
        return false;
    }

    if (destinationSquare.piece.includes("K")) isCheck = true;

    possibleMoves.push(move);
  };
  const calculateLinearMoves = (
    origin: number,
    piece: string,
  ): [number[], boolean] => {
    const directions = getDirectionByPiece(piece);
    const isLimit = getLimits(origin, piece);
    const loops = ["K", "P"].includes(piece.charAt(1)) ? 1 : 7;
    let possibleMoves: number[] = [];
    let isCheck = false;
    let isBlocked: Record<Direction, boolean> = {
      top: false,
      bottom: false,
      left: false,
      right: false,
      tl: false,
      tr: false,
      br: false,
      bl: false,
    };

    for (let i = 0; i < loops; i++) {
      directions.forEach((direction) => {
        evaluateSquare({
          isBlocked,
          direction,
          origin,
          i,
          isLimit,
          piece,
          isCheck,
          possibleMoves,
        });
      });
    }
    setSelectedPieceLegalMoves(possibleMoves);
    return [possibleMoves, isCheck];
  };
  const calculateKnight = (
    origin: number,
    piece: string,
  ): [number[], boolean] => {
    let [row, col] = getRowCol(origin);
    let possibleMoves: number[] = [];
    let isCheck = false;

    if (col >= 1 && row >= 2) possibleMoves.push(origin - 17);
    if (col <= 6 && row >= 2) possibleMoves.push(origin - 15);

    if (col >= 2 && row >= 1) possibleMoves.push(origin - 10);
    if (col <= 5 && row >= 1) possibleMoves.push(origin - 6);

    if (col >= 2 && row <= 6) possibleMoves.push(origin + 6);
    if (col <= 5 && row <= 6) possibleMoves.push(origin + 10);

    if (col >= 1 && row <= 5) possibleMoves.push(origin + 15);
    if (col <= 6 && row <= 5) possibleMoves.push(origin + 17);

    const movesLength = possibleMoves.length;
    for (let i = 0; i < movesLength; i++) {
      const invI = movesLength - 1 - i;
      let destinationSquare = getSquareById(possibleMoves[invI]);

      if (destinationSquare.piece.includes(piece.charAt(0)))
        possibleMoves.splice(invI, 1);
      if (destinationSquare.piece.includes("K")) isCheck = true;
    }

    return [possibleMoves, isCheck];
  };
  const calculatePossibleMoves = (
    origin: number,
    piece: string,
  ): [number[], boolean] => {
    let possibleMoves: number[] = [];
    let isCheck: boolean = false;
    const pieceInitial = piece.charAt(1);
    switch (pieceInitial) {
      case "B":
        [possibleMoves, isCheck] = calculateLinearMoves(origin, piece);
        break;
      case "R":
        [possibleMoves, isCheck] = calculateLinearMoves(origin, piece);
        break;
      case "Q":
        [possibleMoves, isCheck] = calculateLinearMoves(origin, piece);
        break;
      case "K":
        [possibleMoves, isCheck] = calculateLinearMoves(origin, piece);
        break;
      case "N":
        [possibleMoves, isCheck] = calculateKnight(origin, piece);
        break;
      case "P":
        [possibleMoves, isCheck] = calculateLinearMoves(origin, piece);
        break;
    }

    return [possibleMoves, isCheck];
  };

  return {
    getSquareById,
    getRowCol,
    getPerpendiculars,
    getDiagonals,
    getMoveByDirection,
    calculatePossibleMoves,
    getLimits,
    evaluateSquare,
  };
};
