"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import { DiagonalDirection, Direction } from "@/reusable/types/directions";
import { useRef } from "react";

export const useCheckPawn = () => {
  const {
    getSquareById,
    getRowCol,
    getDiagonals,
    getPerpendiculars,
    getMoveByDirection,
  } = useBoardUtils();
  const {
    selectedSquare,
    selectedPieceLegalMoves,
    setBoard,
    setShowQueenPopup,
    setSelectedPieceLegalMoves,
    setUpgradingPawn,
  } = useBoardContext();

  let doubleSquarePawnRef = useRef<number | null>(null);
  let enPessantMoveRef = useRef<number | null>(null);
  let doubleSquarePawn = doubleSquarePawnRef.current;
  let enPessantMove = enPessantMoveRef.current;

  let piece: string;
  let pieceColor: string;

  let destination: number;
  let origin: number;
  let row: number;
  let col: number;

  let isLimit: Record<Direction, number | null> = {
    top: null,
    bottom: null,
    left: null,
    right: null,
    tl: null,
    tr: null,
    br: null,
    bl: null,
  };

  let enPessantDirection: DiagonalDirection | "";

  let possibleMoves: number[] = [];

  const checkIsEnPessant = (isWhite: boolean): DiagonalDirection | "" => {
    if (isWhite) {
      if (origin + 1 == doubleSquarePawn) return "tr";
      else if (origin - 1 == doubleSquarePawn) return "tl";
    } else {
      if (origin + 1 == doubleSquarePawn) return "br";
      else if (origin - 1 == doubleSquarePawn) return "bl";
    }

    return "";
  };
  const checkIsTwoSquareMove = () => {
    const isWhite = pieceColor === "w";
    if (isWhite && selectedPieceLegalMoves.includes(destination + 8)) {
      doubleSquarePawn = destination;
      doubleSquarePawnRef.current = doubleSquarePawn;
    } else if (!isWhite && selectedPieceLegalMoves.includes(destination - 8)) {
      doubleSquarePawn = destination;
      doubleSquarePawnRef.current = doubleSquarePawn;
    } else {
      doubleSquarePawn = null;
      doubleSquarePawnRef.current = doubleSquarePawn;
    }
  };
  const checkSpecialMoves = (isWhite: boolean) => {
    if (isWhite) {
      //check for double move
      if (row == 6) {
        const hasPiece = getSquareById(origin - 8)?.piece;
        !hasPiece && calculatePossibleSquares(1, "top");
      }
      // check for en pessant
      if (row == 3) {
        enPessantDirection = checkIsEnPessant(isWhite);
        if (enPessantDirection != "") {
          calculatePossibleSquares(0, enPessantDirection);
          enPessantMove = possibleMoves[possibleMoves.length - 1];
          enPessantMoveRef.current = enPessantMove;
        }
      }
    } else {
      if (row == 1) {
        const hasPiece = getSquareById(origin + 8)?.piece;
        !hasPiece && calculatePossibleSquares(1, "bottom");
      }
      if (row == 4) {
        enPessantDirection = checkIsEnPessant(isWhite);
        if (enPessantDirection != "") {
          calculatePossibleSquares(0, enPessantDirection);
          enPessantMove = possibleMoves[possibleMoves.length - 1];
          enPessantMoveRef.current = enPessantMove;
        }
      }
    }
  };
  const handleIsEnPessant = () => {
    if (enPessantMove != destination) return;
    const opponentPawn = pieceColor === "w" ? destination + 8 : destination - 8;
    setBoard((prevBoard) =>
      prevBoard.map((row) =>
        row.map((square) => {
          if (square.id === opponentPawn) {
            // remove selected piece
            return { ...square, piece: "" };
          } else {
            return square;
          }
        }),
      ),
    );
  };
  const handleIsQueen = () => {
    const row = Math.floor(destination / 8);
    if (row == 0 || row == 7) {
      setUpgradingPawn(destination);
      setShowQueenPopup(true);
    }
  };
  const calculatePossibleSquares = (i: number, direction: Direction) => {
    const isIndexDecreacing = ["tr", "tl", "top"].includes(direction);
    const move = getMoveByDirection(origin, i, direction);
    const limit = isLimit[direction] as number;

    // checks que no este afuera del tablero
    if (isIndexDecreacing && move < limit) return false;
    if (!isIndexDecreacing && move > limit) return false;

    // si es diagonal (y NO en pessant) revisa si hay una pieza comible
    const destinationSquare = getSquareById(move);
    if (
      direction != enPessantDirection &&
      ["tr", "tl", "br", "bl"].includes(direction) &&
      destinationSquare.piece == ""
    )
      return false;

    // si es vertical revisa si hay una pieza bloqueando
    if (["top", "bottom"].includes(direction) && destinationSquare.piece != "")
      return false;

    if (destinationSquare.piece.includes(pieceColor)) return false;

    possibleMoves.push(move);
  };
  const calculateAllOrientations = () => {
    const isWhite = pieceColor == "w";
    const directions: Direction[] = isWhite
      ? ["tr", "tl", "top"]
      : ["br", "bl", "bottom"];

    directions.forEach((direction: Direction) => {
      calculatePossibleSquares(0, direction);
    });

    checkSpecialMoves(isWhite);
    setSelectedPieceLegalMoves(possibleMoves);
  };
  const calculatePawn = (originParam: number) => {
    possibleMoves = [];
    piece = getSquareById(originParam).piece;
    pieceColor = piece.charAt(0);

    origin = originParam;
    ({ row, col } = getRowCol(origin));
    const dLimits = getDiagonals(origin, row, col);
    const pLimits = getPerpendiculars(origin, row, col);
    isLimit = { ...dLimits, ...pLimits };

    calculateAllOrientations();

    return possibleMoves;
  };
  const validatePawn = (destinationL: number) => {
    setSelectedPieceLegalMoves([]);

    const isValid = selectedPieceLegalMoves.includes(destinationL);
    if (!isValid) return false;
    piece = getSquareById(selectedSquare!).piece;
    pieceColor = piece.charAt(0);
    destination = destinationL;
    isValid && checkIsTwoSquareMove();

    handleIsQueen();
    handleIsEnPessant();

    return true;
  };

  return { calculatePawn, validatePawn };
};
