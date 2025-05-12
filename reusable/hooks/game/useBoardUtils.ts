"use client";

import { useBoardContext } from "../../context/BoardContext";

export const useBoardUtils = () => {
  const { board } = useBoardContext();

  const getSquareById = (index: number) => {
    const row = Math.floor(index / 8);
    const rowSquare = index - row * 8;

    return board[row][rowSquare];
  };

  return { getSquareById };
};
