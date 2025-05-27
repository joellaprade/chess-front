"use client";

import { useBoardContext } from "../../context/BoardContext";
import { DiagonalDirection, Direction } from "@/reusable/types/directions";
import { PerpendicularDirection } from "@/reusable/types/directions";
import { EvalSquareParam } from "@/reusable/types/evalSquareParamType";

export const useBoardUtils = () => {
  const { board, setSelectedPieceLegalMoves, getPinData, setPinData } = useBoardContext();

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
    const pDirections: PerpendicularDirection[] = ["top", "bottom", "left", "right"];
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
        directions = piece.charAt(0) === "w" ? ["tr", "tl", "top"] : ["br", "bl", "bottom"];
        break;
    }

    return directions;
  };
  const compareObjects = (a: Record<any, any>, b: Record<any, any>) => {
    return JSON.stringify(a) == JSON.stringify(b);
  };
  const calculateIsSquareBeingAttacked = (destination: number, piece: string) => {
    const directions = getDirectionByPiece(piece);
    const isLimit = getLimits(destination, piece);
    let possibleMoves: number[] = [];
    let isCheck = false;
    let isAttacked = false;
    let isPin = false;
    let isCalcMoves = false;
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

    for (let i = 0; i < 7; i++) {
      directions.forEach((direction) => {
        [possibleMoves, isCheck, isAttacked, isPin] = evaluateSquare({
          isBlocked,
          direction,
          origin: destination,
          i,
          isLimit,
          piece,
          isCheck,
          isAttacked,
          isPin,
          isCalcMoves,
          recursionLayer: 1,
          possibleMoves,
        });
      });
    }

    const opponentColor = piece.charAt(0) == "w" ? "b" : "w";
    const [knightPossibleMoves] = calculateKnight(destination, `${opponentColor}N`, false, 1);
    knightPossibleMoves.forEach((move) => {
      const oppPiece = getSquareById(move).piece;
      if (oppPiece == `${opponentColor}N`) isAttacked = true;
    });

    return isAttacked;
  };
  const evaluateIsBeingAttacked = (
    origin: number,
    destSquare: {
      id: number;
      code: string;
      piece: string;
    },
  ): boolean => {
    const [oRow, oCol] = getRowCol(origin);
    const [dRow, dCol] = getRowCol(destSquare.id);
    const oDiagonal = getDiagonals(origin, oRow, oCol);
    const dDiagonal = getDiagonals(destSquare.id, dRow, dCol);
    let isAttacked = false;

    switch (destSquare.piece.charAt(1)) {
      case "Q":
        isAttacked =
          oRow == dRow ||
          oCol == dCol ||
          oDiagonal.tl == dDiagonal.tl ||
          oDiagonal.tr == dDiagonal.tr;
        break;
      case "K":
        isAttacked =
          (oRow == dRow ||
            oCol == dCol ||
            oDiagonal.tl == dDiagonal.tl ||
            oDiagonal.tr == dDiagonal.tr) &&
          Math.abs(oRow - dRow) <= 1 &&
          Math.abs(oCol - dCol) <= 1;
        break;
      case "R":
        isAttacked = oRow == dRow || oCol == dCol;
        break;
      case "B":
        isAttacked = oDiagonal.tl == dDiagonal.tl || oDiagonal.tr == dDiagonal.tr;
        break;
      case "P":
        isAttacked =
          (oDiagonal.tl == dDiagonal.tl || oDiagonal.tr == dDiagonal.tr) &&
          Math.abs(oRow - dRow) <= 1 &&
          Math.abs(oCol - dCol) <= 1;
        break;
    }

    return isAttacked;
  };
  const runChecks = (
    destSquare: {
      id: number;
      code: string;
      piece: string;
    },
    piece: string,
    isCheck: boolean,
    recursionLayer: number,
    isAttacked: boolean,
    origin: number,
    isBlocked?: Record<Direction, boolean> | undefined,
    direction?: Direction,
  ): [boolean, boolean, Record<Direction, boolean>] => {
    // Evalua si una pieza esta bloqueando a otra (como un peon a un arfil)
    if (isBlocked && direction && destSquare.piece != "" && destSquare.piece != piece)
      isBlocked[direction] = true;
    // Evalua si el atacante puede alcanzar al rey
    if (destSquare.piece.charAt(1) === "K" && destSquare.piece != piece) isCheck = true;
    if (recursionLayer == 0) {
      // Decide si debe interpretar este square como possibleMove de rey
      if (piece.charAt(1) == "K" && calculateIsSquareBeingAttacked(destSquare.id, piece))
        isAttacked = true;
      // Decide si debe interpretar este square como isBeingAttacked
    } else if (recursionLayer == 1) {
      // Evalua si el cuadro esta siendo atacado
      if (
        piece.charAt(1) == "K" &&
        piece.charAt(0) != destSquare.piece.charAt(0) &&
        evaluateIsBeingAttacked(origin, destSquare)
      ) {
        isAttacked = true;
      }
    }

    return [isCheck, isAttacked, isBlocked || ({} as Record<Direction, boolean>)];
  };
  const runValidations = (
    destSquare: {
      id: number;
      code: string;
      piece: string;
    },
    piece: string,
    isAttacked: boolean,
    origin: number,
    extras: any,
    isBlocked: Record<Direction, boolean>,
    direction: Direction,
  ): boolean => {
    // Si la pieza bloqueando es del mismo color, retorna para NO agregarla a possible moves
    if (destSquare.piece.charAt(0) == piece.charAt(0)) return false;
    // Reglas de peon
    if (piece.charAt(1) === "P") {
      // Calcula que no haya una pieza al frente (peones solo comen en diagonal)
      if (["top", "bottom"].includes(direction) && destSquare.piece != "") return false;
      // Revisa que haya una pieza diagonalmente para comersela
      if (
        (direction != extras?.direction || origin != extras?.origin) &&
        ["tr", "tl", "br", "bl"].includes(direction) &&
        destSquare.piece == ""
      )
        return false;
    }

    // Reglas de rey
    if (piece.charAt(1) === "K" && isAttacked) return false;

    const pinnedOrigins = getPinData().map((pinData) => pinData.pinned);
    if (pinnedOrigins.includes(origin)) return false;

    return true;
  };
  const countBlockingPieces = (
    coinsidingLimit: { direction: Direction; limit: number },
    origin: number,
  ): [number, number | undefined] => {
    let blockingPiecesCount = 0;
    let blockingPieceSquare: number | undefined;
    let reachedLimit = false;
    let i = 0;
    while (!reachedLimit) {
      const destination = getMoveByDirection(origin, i, coinsidingLimit.direction);
      const destSquare = getSquareById(destination);
      if (destSquare.piece != "" && destSquare.piece.charAt(1) != "K") {
        blockingPieceSquare = destSquare.id;
        blockingPiecesCount++;
      }

      if (destination == coinsidingLimit.limit || destSquare.piece.charAt(1) == "K")
        reachedLimit = true;

      i++;
    }

    return [blockingPiecesCount, blockingPieceSquare];
  };
  const cleanPinnedPieces = (isCalcMoves: boolean) => {
    isCalcMoves &&
      getPinData().forEach((pinData, i) => {
        const attackerOldSquare = getSquareById(pinData.attacker);

        if (attackerOldSquare.piece == "") {
          console.log(attackerOldSquare);
          let pinnedPieces = getPinData();
          pinnedPieces.splice(i, 1);
          setPinData(pinnedPieces);
        }
      });
  };
  const checkIsAttackerPinning = (
    origin: number,
    destSquare: {
      id: number;
      code: string;
      piece: string;
    },
    piece: string,
    isBlocked: boolean,
  ) => {
    if (
      !destSquare.piece.includes("K") ||
      destSquare.piece.charAt(0) == piece.charAt(0) ||
      !isBlocked
    )
      return undefined;
    // contar cantidad de piezas para ver si efectivamente esta pineando
    const kOrigin = destSquare.id;
    const [kRow, kCol] = getRowCol(kOrigin);
    const kPLimits = getPerpendiculars(kOrigin, kRow, kCol);
    const kDLimits = getDiagonals(kOrigin, kRow, kCol);
    const kLimits: Record<string, number> = { ...kPLimits, ...kDLimits };

    const [aRow, aCol] = getRowCol(origin);
    const aPLimits = getPerpendiculars(origin, aRow, aCol);
    const aDLimits = getDiagonals(origin, aRow, aCol);
    const aLimits: Record<string, number> = { ...aPLimits, ...aDLimits };

    let pinData:
      | { direction: Direction; limit: number; attacker: number; pinned: number | undefined }
      | undefined;

    // Reviso si rey y atacante comparten row, col o diag
    (["top", "left", "tr", "tl"] as Direction[]).forEach((direction) => {
      if (kLimits[direction] == aLimits[direction]) {
        pinData = {
          direction,
          limit: kLimits[direction],
          attacker: origin,
          pinned: undefined,
        };

        // Se cuentan piezas bloqueando
        let [blockingPiecesCount, blockingPieceSquare] = countBlockingPieces(pinData, origin);
        pinData.pinned = blockingPieceSquare;

        // Se asegura que no se dupliquen los registros cuando selecciono una pieza
        let isAttackerRepeated = false;
        getPinData().forEach((piece) => {
          if (pinData) isAttackerRepeated = compareObjects(piece, pinData);
        });

        // Reviso todos los attackingSquares y veo si hay uno invalido

        // Decide si incluir coinsidingLimit
        if (blockingPiecesCount == 1 && !isAttackerRepeated) {
          const pinnedPieces = getPinData();
          pinnedPieces.push(pinData);
          setPinData(pinnedPieces);
          console.log(origin, getPinData());

          return pinData;
        }
      }
    });

    return pinData;
  };
  const evaluateSquare = ({
    isBlocked,
    direction,
    origin,
    i,
    isLimit,
    piece,
    isCheck,
    isAttacked,
    isPin,
    isCalcMoves,
    possibleMoves,
    recursionLayer,
    extras,
  }: EvalSquareParam): [number[], boolean, boolean, boolean] => {
    // Revisar si no se comporta raro si me como a la pieza pinneando (atacante)

    const isIndexDecreacing = ["tr", "tl", "top", "left"].includes(direction);
    let move = getMoveByDirection(origin, i, direction);
    let limit = isLimit[direction] as number;
    // Calcula que el move siendo calculado este dentro del tablero
    if (isIndexDecreacing && move < limit) return [possibleMoves, isCheck, isAttacked, isPin];
    if (!isIndexDecreacing && move > limit) return [possibleMoves, isCheck, isAttacked, isPin];
    // Evalua si el atacante esta viendo al rey
    const destSquare = getSquareById(move);

    cleanPinnedPieces(isCalcMoves);
    checkIsAttackerPinning(origin, destSquare, piece, isBlocked[direction]);

    if (isPin) {
      return [possibleMoves, isCheck, isAttacked, isPin];
    }

    // Evalua si ya habia una pieza bloqueando este paso
    if (isBlocked[direction]) return [possibleMoves, isCheck, isAttacked, isPin];

    [isCheck, isAttacked, isBlocked] = runChecks(
      destSquare,
      piece,
      isCheck,
      recursionLayer,
      isAttacked,
      origin,
      isBlocked,
      direction,
    );
    const isValid = runValidations(
      destSquare,
      piece,
      isAttacked,
      origin,
      extras,
      isBlocked,
      direction,
    );

    if (!isValid) return [possibleMoves, isCheck, isAttacked, isPin];

    possibleMoves.push(move);
    return [possibleMoves, isCheck, isAttacked, isPin];
  };
  const calculateLinearMoves = (
    origin: number,
    piece: string,
    isCalcMoves: boolean,
  ): [number[], boolean, boolean] => {
    const directions = getDirectionByPiece(piece);
    const isLimit = getLimits(origin, piece);
    const loops = ["K", "P"].includes(piece.charAt(1)) ? 1 : 7;
    let possibleMoves: number[] = [];
    let isCheck = false;
    let isAttacked = false;
    let isPin = false;
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
    let temp;

    for (let i = 0; i < loops; i++) {
      directions.forEach((direction) => {
        [possibleMoves, isCheck, temp] = evaluateSquare({
          isBlocked,
          direction,
          origin,
          i,
          isLimit,
          piece,
          isCheck,
          isAttacked,
          isPin,
          isCalcMoves,
          recursionLayer: 0,
          possibleMoves,
        });
      });
    }
    setSelectedPieceLegalMoves(possibleMoves);
    return [possibleMoves, isCheck, isAttacked];
  };
  const calculateKnight = (
    origin: number,
    piece: string,
    isCalcMoves: boolean,
    recursionLayer?: number,
  ): [number[], boolean] => {
    recursionLayer = recursionLayer || 0;
    let [row, col] = getRowCol(origin);
    let possibleMoves: number[] = [];
    let isCheck = false;
    let isAttacked = false;

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
      let destSquare = getSquareById(possibleMoves[invI]);

      [isCheck, isAttacked] = runChecks(destSquare, piece, isCheck, 0, isAttacked, origin);

      if (destSquare.piece.includes(piece.charAt(0)) && recursionLayer != 1)
        possibleMoves.splice(invI, 1);
      if (destSquare.piece.includes("K")) isCheck = true;
    }

    console.log(isCalcMoves);

    cleanPinnedPieces(isCalcMoves);

    const pinnedOrigins = getPinData().map((pinData) => pinData.pinned);
    if (pinnedOrigins.includes(origin)) possibleMoves = [];

    return [possibleMoves, isCheck];
  };
  const calculatePossibleMoves = (
    origin: number,
    piece: string,
    isCalcMoves: boolean,
  ): [number[], boolean] => {
    let possibleMoves: number[] = [];
    let isCheck: boolean = false;
    const pieceInitial = piece.charAt(1);
    switch (pieceInitial) {
      case "B":
        [possibleMoves, isCheck] = calculateLinearMoves(origin, piece, isCalcMoves);
        break;
      case "R":
        [possibleMoves, isCheck] = calculateLinearMoves(origin, piece, isCalcMoves);
        break;
      case "Q":
        [possibleMoves, isCheck] = calculateLinearMoves(origin, piece, isCalcMoves);
        break;
      case "K":
        [possibleMoves, isCheck] = calculateLinearMoves(origin, piece, isCalcMoves);
        break;
      case "N":
        [possibleMoves, isCheck] = calculateKnight(origin, piece, isCalcMoves);
        break;
      case "P":
        [possibleMoves, isCheck] = calculateLinearMoves(origin, piece, isCalcMoves);
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
