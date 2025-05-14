"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";

export const useCheckKnight = () => {
  const { getSquareById, getRowCol } = useBoardUtils();
  const { selectedPieceLegalMoves, setSelectedPieceLegalMoves } =
    useBoardContext();
  let piece: string;
  let pieceColor: string;

  let origin: number;
  let row: number;
  let col: number;

  let possibleMoves: number[] = [];

  const calculatePossibleSquares = () => {
    let moves: number[] = [];

    if (col >= 1 && row >= 2) moves.push(origin - 17);
    if (col <= 6 && row >= 2) moves.push(origin - 15);

    if (col >= 2 && row >= 1) moves.push(origin - 10);
    if (col <= 5 && row >= 1) moves.push(origin - 6);

    if (col >= 2 && row <= 6) moves.push(origin + 6);
    if (col <= 5 && row <= 6) moves.push(origin + 10);

    if (col >= 1 && row <= 5) moves.push(origin + 15);
    if (col <= 6 && row <= 5) moves.push(origin + 17);

    const movesLength = moves.length;
    for (let i = 0; i < movesLength; i++) {
      const invI = movesLength - 1 - i;
      let destinationSquare = getSquareById(moves[invI]);

      if (destinationSquare.piece.includes(pieceColor)) moves.splice(invI, 1);
    }

    possibleMoves = moves;
  };
  const calculateKnight = (originParam: number) => {
    possibleMoves = [];
    piece = getSquareById(originParam).piece;
    pieceColor = piece.charAt(0);

    origin = originParam;
    ({ row, col } = getRowCol(origin));

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
