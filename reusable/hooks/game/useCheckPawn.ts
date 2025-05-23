"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useBoardContext } from "@/reusable/context/BoardContext";
import { DiagonalDirection, Direction } from "@/reusable/types/directions";
import useRefState from "../useRefState";
import { EvalSquareParam } from "@/reusable/types/evalSquareParamType";

export const useCheckPawn = () => {
  const {
    calculatePossibleMoves,
    getSquareById,
    getRowCol,
    getMoveByDirection,
    getLimits,
  } = useBoardUtils();
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
  const [getEnPessantDirection, setEnPessantDirection] = useRefState(null);

  // Before
  const checkIsEnPessant = (isWhite: boolean): DiagonalDirection | "" => {
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
  // After
  const checkIsTwoSquareMove = (destination: number) => {
    const isWhite = getPieceColor() === "w";
    if (isWhite && selectedPieceLegalMoves.includes(destination + 8)) {
      setDoubleSquarePawn(destination);
    } else if (!isWhite && selectedPieceLegalMoves.includes(destination - 8)) {
      setDoubleSquarePawn(destination);
    } else {
      setDoubleSquarePawn(null);
    }
  };
  // Before
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
      setEnPessantDirection(checkIsEnPessant(isWhite));
      if (getEnPessantDirection() != "") {
        evaluateSquare({
          ...evalParam,
          i: 0,
          direction: getEnPessantDirection(),
        });
        setEnPessantMove(possibleMoves[possibleMoves.length - 1]);
      }
    }

    return possibleMoves;
  };
  // After
  const handleIsEnPessant = (destination: number) => {
    if (getEnPessantMove() != destination) return;
    const opponentPawn =
      getPieceColor() === "w" ? destination + 8 : destination - 8;
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
  // After
  const handleIsQueen = (destination: number) => {
    const row = Math.floor(destination / 8);
    if (row == 0 || row == 7) {
      setUpgradingPawn(destination);
      setShowQueenPopup(true);
    }
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
  }: EvalSquareParam) => {
    const isIndexDecreacing = ["tr", "tl", "top"].includes(direction);
    const move = getMoveByDirection(origin, 0, direction);
    const limit = isLimit[direction] as number;

    // checks que no este afuera del tablero
    if (isIndexDecreacing && move < limit) return false;
    if (!isIndexDecreacing && move > limit) return false;

    // si es diagonal (y NO en pessant) revisa si hay una pieza comible
    const destinationSquare = getSquareById(move);
    if (
      direction != getEnPessantDirection() &&
      ["tr", "tl", "br", "bl"].includes(direction) &&
      destinationSquare.piece == ""
    )
      return false;

    // si es vertical revisa si hay una pieza bloqueando
    if (["top", "bottom"].includes(direction) && destinationSquare.piece != "")
      return false;

    if (destinationSquare.piece.includes(getPieceColor())) return false;

    possibleMoves.push(move);
  };
  const calculatePawn = (origin: number) => {
    const piece = getSquareById(origin).piece;
    const [possibleMoves] = calculatePossibleMoves(origin, piece);
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
    const specialMoves = checkSpecialMoves(evalParam, possibleMoves);
    // possibleMoves.push([...specialMoves]);

    return possibleMoves;
    /*





    */
    // let isCheck = false;
    // let isBlocked: Record<Direction, boolean> = {
    //   top: false,
    //   bottom: false,
    //   left: false,
    //   right: false,
    //   tl: false,
    //   tr: false,
    //   br: false,
    //   bl: false,
    // };
    // let possibleMoves: number[] = [];
    // let piece = getSquareById(origin).piece;

    // setOrigin(origin);
    // const [row, col] = getRowCol(origin);
    // const dLimits = getDiagonals(origin, row, col);
    // const pLimits = getPerpendiculars(origin, row, col);
    // const isLimit = { ...dLimits, ...pLimits };
    // const isWhite = getPieceColor() == "w";
    // const directions: Direction[] = isWhite
    //   ? ["tr", "tl", "top"]
    //   : ["br", "bl", "bottom"];

    // let evalParam = {
    //   isBlocked,
    //   origin,
    //   isLimit,
    //   piece,
    //   isCheck,
    //   possibleMoves,
    // };

    // directions.forEach((direction: Direction) => {
    //   evaluateSquare({ ...evalParam, direction, i: 0 });
    // });

    // checkSpecialMoves(evalParam, row, possibleMoves);
    // setSelectedPieceLegalMoves(possibleMoves);
    // return possibleMoves;
  };
  const validatePawn = (destination: number) => {
    const isValid = selectedPieceLegalMoves.includes(destination);
    if (!isValid) return false;

    checkIsTwoSquareMove(destination);
    handleIsQueen(destination);
    handleIsEnPessant(destination);

    const piece = getSquareById(selectedSquare!).piece;
    // const [_, isCheck] = calculatePossibleMoves(destination, piece);

    setSelectedPieceLegalMoves([]);
    return true;
  };

  return { calculatePawn, validatePawn };
};

/*

cual es el plan?

utilizar evalSquare de utils en pawn

que hay que hacer?
integrar las reglas de pawn a evalSquare

checkSpecialMoves usa evalSquare




*/

/*



*/
