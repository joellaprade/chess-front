"use client";

import useRefState from "../useRefState";
import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";

export const useCheckKnight = () => {
  const { getSquareById, getRowCol, checkIsCheck } = useBoardUtils();
  const { selectedPieceLegalMoves, setSelectedPieceLegalMoves } =
    useBoardContext();
  const [getPiece, setPiece] = useRefState(null);
  let pieceColor: string;

  let origin: number;
  let row: number;
  let col: number;

  let possibleMoves: number[] = [];

  const evaluateSquare = () => {
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
    setPiece(getSquareById(originParam).piece);
    pieceColor = getPiece().charAt(0);

    origin = originParam;
    [row, col] = getRowCol(origin);

    evaluateSquare();

    return possibleMoves;
  };
  const validateKnight = (destination: number) => {
    const isCheck = checkIsCheck(getPiece(), destination);

    setSelectedPieceLegalMoves([]);
    if (selectedPieceLegalMoves.includes(destination)) return true;
    else return false;
  };

  return { calculateKnight, validateKnight };
};
