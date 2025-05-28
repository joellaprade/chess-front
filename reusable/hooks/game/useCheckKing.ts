"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import useRefState from "../useRefState";

export const useCheckKing = () => {
  const { calculatePossibleMoves, getSquareById } = useBoardUtils();
  const { selectedPieceLegalMoves, setBoard, setSelectedPieceLegalMoves, getHasRookMove } =
    useBoardContext();
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
    let [possibleMoves] = calculatePossibleMoves(origin, piece, true);
    setOrigin(origin);
    const castleMoves = calculateCastle();
    possibleMoves.push(...castleMoves);

    return possibleMoves;
  };
  const handleCastle = (destination: number) => {
    const origin = getOrigin();
    const kingSquare = getSquareById(origin);
    const pieceColorInitial = kingSquare.piece.charAt(0);
    const isWhite = pieceColorInitial == "w";
    let rookDestination: number;
    let kingDestination: number;

    if (isWhite) {
      if (getHasKingMoved().white) return false;
      if (destination == 56) {
        rookDestination = 59;
        kingDestination = 58;
      }
      if (destination == 63) {
        rookDestination = 61;
        kingDestination = 62;
      }
    } else {
      if (getHasKingMoved().black) return false;
      if (destination == 0) {
        rookDestination = 3;
        kingDestination = 2;
      }
      if (destination == 7) {
        rookDestination = 5;
        kingDestination = 6;
      }
    }

    setBoard((prevBoard) =>
      prevBoard.map((row) =>
        row.map((square) => {
          if (square.id === rookDestination) {
            // remove selected piece
            return { ...square, piece: `${pieceColorInitial}R` };
          } else if (square.id === kingDestination) {
            return { ...square, piece: `${pieceColorInitial}K` };
          } else if (square.id === destination) {
            return { ...square, piece: "" };
          } else if (square.id === origin) {
            return { ...square, piece: "" };
          } else {
            return square;
          }
        }),
      ),
    );

    return true;
  };
  const validateKing = (destination: number) => {
    let isValid = selectedPieceLegalMoves.includes(destination);
    isValid = !handleCastle(destination);
    if (!isValid) return false;

    checkHasMoved();
    setSelectedPieceLegalMoves([]);

    return true;
  };

  return { calculateKing, validateKing };
};

// Integrar al rey dentro de calcLongPieces (y cambiar ese nombre)
