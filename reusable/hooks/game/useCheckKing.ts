"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import { Direction } from "@/reusable/types/directions";
import useRefState from "../useRefState";

export const useCheckKing = () => {
  const {
    calculatePossibleMoves,
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
  const [getOrigin, setOrigin] = useRefState(null);
  const [getHasKingMoved, setHasKingMoved] = useRefState({
    white: false,
    black: false,
  });

  const checkHasMoved = () => {
    const pieceColor = getSquareById(getOrigin()).piece.charAt(0);
    if (!getHasKingMoved().white && pieceColor == "w") {
      setHasKingMoved(true, "white");
    }
    if (!getHasKingMoved().black && pieceColor == "b") {
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
    const pieceColor = getSquareById(getOrigin()).piece.charAt(0);
    let possibleMoves: number[] = [];

    if (pieceColor == "w") {
      if (getHasKingMoved().white) return [];
      let { canCastleL, canCastleR } = checkIsRowClear(7);

      if (canCastleL && !getHasRookMove().white.left) possibleMoves.push(56);
      if (canCastleR && !getHasRookMove().white.right) possibleMoves.push(63);
    } else {
      if (getHasKingMoved().black) return [];
      let { canCastleL, canCastleR } = checkIsRowClear(0);

      if (canCastleL && !getHasRookMove().black.left) possibleMoves.push(0);
      if (canCastleR && !getHasRookMove().black.right) possibleMoves.push(7);
    }

    return possibleMoves;
  };
  const calculateKing = (origin: number) => {
    const piece = getSquareById(origin).piece;
    let [possibleMoves] = calculatePossibleMoves(origin, piece);
    setOrigin(origin);
    const castleMoves = calculateCastle();
    possibleMoves.push(...castleMoves);

    return possibleMoves;
  };
  const validateKing = (destination: number) => {
    const isValid = selectedPieceLegalMoves.includes(destination);
    if (!isValid) return false;

    checkHasMoved();
    setSelectedPieceLegalMoves([]);

    return true;
  };

  return { calculateKing, validateKing };
};

// Integrar al rey dentro de calcLongPieces (y cambiar ese nombre)
