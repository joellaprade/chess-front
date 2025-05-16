"use client";

import { useBoardContext } from "../../context/BoardContext";
import { DiagonalDirection } from "@/reusable/types/directions";
import { PerpendicularDirection } from "@/reusable/types/directions";

export const useBoardUtils = () => {
  const { board } = useBoardContext();

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

  return {
    getSquareById,
    getRowCol,
    getPerpendiculars,
    getDiagonals,
    getMoveByDirection,
  };
};
