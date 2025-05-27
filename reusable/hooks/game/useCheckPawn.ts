"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import { DiagonalDirection, Direction } from "@/reusable/types/directions";
import useRefState from "../useRefState";
import { EvalSquareParam } from "@/reusable/types/evalSquareParamType";

export const useCheckPawn = () => {
  const { evaluateSquare, calculatePossibleMoves, getSquareById, getRowCol, getLimits } =
    useBoardUtils();
  const {
    selectedSquare,
    selectedPieceLegalMoves,
    setBoard,
    setShowQueenPopup,
    setSelectedPieceLegalMoves,
    setUpgradingPawn,
  } = useBoardContext();

  const [getOrigin, setOrigin] = useRefState(null);
  const [getPieceColor, setPieceColor] = useRefState(null);
  const [getDoubleSquarePawn, setDoubleSquarePawn] = useRefState(null);
  const [getEnPessantMove, setEnPessantMove] = useRefState(null);
  const [getEnPessant, setEnPessant] = useRefState({
    origin: null,
    direction: null,
    color: null,
  });

  const checkIsEnPessant = (isWhite: boolean): DiagonalDirection | "" => {
    if (!getDoubleSquarePawn()) return "";
    const origin = getOrigin();
    if (isWhite) {
      if (origin + 1 == getDoubleSquarePawn()) return "tr";
      else if (origin - 1 == getDoubleSquarePawn()) return "tl";
    } else {
      if (origin + 1 == getDoubleSquarePawn()) return "br";
      else if (origin - 1 == getDoubleSquarePawn()) return "bl";
    }

    return "";
  };
  const checkIsTwoSquareMove = (destination: number) => {
    const isWhite = getPieceColor() === "w";
    const destinationOffset = isWhite ? destination + 8 : destination - 8;
    if (selectedPieceLegalMoves.includes(destinationOffset)) {
      setDoubleSquarePawn(destination);
    } else {
      setDoubleSquarePawn(null);
    }
  };
  const checkSpecialMoves = (
    evalParam: Omit<EvalSquareParam, "i" | "direction">,
    possibleMoves: number[],
  ) => {
    const origin = getOrigin();
    const [row, _] = getRowCol(origin);
    const isWhite = getPieceColor() === "w";
    const doubleMoveRow = isWhite ? 6 : 1;
    const enPessantMoveRow = isWhite ? 3 : 4;
    const possiblePieceOrigin = isWhite ? origin - 8 : origin + 8;
    const direction = isWhite ? "top" : "bottom";

    //check for double move
    if (row == doubleMoveRow) {
      const hasPiece = getSquareById(possiblePieceOrigin)?.piece;
      !hasPiece && evaluateSquare({ ...evalParam, i: 1, direction });
    }
    // check for en pessant
    if (row == enPessantMoveRow) {
      const direction = checkIsEnPessant(isWhite);
      if (direction) {
        setEnPessant({ origin, direction, color: getPieceColor() });
        evaluateSquare({
          ...evalParam,
          i: 0,
          direction: getEnPessant().direction,
          extras: getEnPessant(),
        });
        setEnPessantMove(possibleMoves[possibleMoves.length - 1]);
      }
    }

    return possibleMoves;
  };
  const handleIsEnPessant = (destination: number) => {
    if (getEnPessantMove() != destination) return;
    const opponentPawn = getPieceColor() === "w" ? destination + 8 : destination - 8;
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
  const handleIsQueen = (destination: number) => {
    const row = Math.floor(destination / 8);
    if (row == 0 || row == 7) {
      setUpgradingPawn(destination);
      setShowQueenPopup(true);
    }
  };
  const calculatePawn = (origin: number) => {
    const piece = getSquareById(origin).piece;
    const [possibleMoves] = calculatePossibleMoves(origin, piece, true);
    setOrigin(origin);
    setPieceColor(piece.charAt(0));

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
    const isLimit = getLimits(origin, piece);
    let evalParam = {
      isBlocked,
      origin,
      isLimit,
      piece,
      isCheck: false,
      possibleMoves,
    };
    checkSpecialMoves(evalParam, possibleMoves);

    return possibleMoves;
  };
  const validatePawn = (destination: number) => {
    const isValid = selectedPieceLegalMoves.includes(destination);
    if (!isValid) return false;

    checkIsTwoSquareMove(destination);
    handleIsQueen(destination);
    handleIsEnPessant(destination);

    const piece = getSquareById(getOrigin()).piece;
    const [_, isCheck] = calculatePossibleMoves(destination, piece, false);

    setSelectedPieceLegalMoves([]);
    return true;
  };

  return {
    calculatePawn,
    validatePawn,
    getDoubleSquarePawn,
    setDoubleSquarePawn,
    getEnPessant,
  };
};
