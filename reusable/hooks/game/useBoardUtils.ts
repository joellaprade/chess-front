"use client";

import { useBoardContext } from "../../context/BoardContext";
import { DiagonalDirection, Direction } from "@/reusable/types/directions";
import { PerpendicularDirection } from "@/reusable/types/directions";
import { EvalSquareParam } from "@/reusable/types/evalSquareParamType";
import { AttackData } from "@/reusable/types/attackData";

export const useBoardUtils = () => {
  const { board, getAttackData, setAttackData, getDefenseData, setDefenseData, setIsCheckMate } =
    useBoardContext();

  // GETTERS & UTILS
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
  // Specific Calcs
  const cleanAttackData = () => {
    let cleanAttackData = getAttackData() as AttackData[];
    const seen = new Map();
    cleanAttackData.forEach((item) => {
      const key = `${item.attacker}-${item.direction}`;
      seen.set(key, item);
    });
    cleanAttackData = Array.from(seen.values());
    setAttackData(cleanAttackData as [AttackData]);
  };
  const calculateIsSquareBeingAttacked = (
    destination: number,
    piece: string,
    isEvaluatingDefense: boolean,
    isEvaluatingCheck: boolean,
  ) => {
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
          isEvaluatingDefense,
          isEvaluatingCheck,
          recursionLayer: 1,
          possibleMoves,
        });
      });
    }

    const opponentColor = piece.charAt(0) == "w" ? "b" : "w";
    const [knightPossibleMoves] = calculateKnight(
      destination,
      `${opponentColor}N`,
      false,
      isEvaluatingDefense,
      isEvaluatingCheck,
      false,
      1,
    );
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
    isEvaluatingDefense: boolean,
    isEvaluatingCheck: boolean,
    piece: string,
  ): boolean => {
    // Origin es del square siendo evaluado (evaluando si esta bajo ataque)
    // Dest square es todos los squares que podrian atacar a origin
    const [oRow, oCol] = getRowCol(origin);
    const [dRow, dCol] = getRowCol(destSquare.id);
    const oDiagonal = getDiagonals(origin, oRow, oCol);
    const dDiagonal = getDiagonals(destSquare.id, dRow, dCol);
    let isAttacked = false;
    let defenseData = getDefenseData();
    let defendedSquare = getSquareById(origin);
    const oppColor = piece.charAt(0) == "w" ? "b" : "w";
    const [possibleKnightMoves] = calculateKnight(
      origin,
      `${oppColor}N`,
      false,
      isEvaluatingDefense,
      isEvaluatingCheck,
      false,
    );

    switch (destSquare.piece.charAt(1)) {
      case "Q":
        if (
          oRow == dRow ||
          oCol == dCol ||
          oDiagonal.tl == dDiagonal.tl ||
          oDiagonal.tr == dDiagonal.tr
        ) {
          isAttacked = true;
          defenseData.push(defendedSquare);
        }
        break;
      case "K":
        if (isEvaluatingCheck && isEvaluatingDefense) break;
        isAttacked =
          (oRow == dRow ||
            oCol == dCol ||
            oDiagonal.tl == dDiagonal.tl ||
            oDiagonal.tr == dDiagonal.tr) &&
          Math.abs(oRow - dRow) <= 1 &&
          Math.abs(oCol - dCol) <= 1;
        isAttacked && defenseData.push(defendedSquare);
        break;
      case "R":
        if (oRow == dRow || oCol == dCol) {
          isAttacked = true;
          defenseData.push(defendedSquare);
        }
        break;
      case "B":
        if (oDiagonal.tl == dDiagonal.tl || oDiagonal.tr == dDiagonal.tr) {
          isAttacked = true;
          defenseData.push(defendedSquare);
        }
        break;
      case "P":
        if (
          (oDiagonal.tl == dDiagonal.tl || oDiagonal.tr == dDiagonal.tr) &&
          Math.abs(oRow - dRow) <= 1 &&
          Math.abs(oCol - dCol) <= 1
        ) {
          if (
            (piece.charAt(0) == "w" && destSquare.id < origin) ||
            (piece.charAt(0) == "b" && destSquare.id > origin)
          ) {
            isAttacked = true;
            defenseData.push(defendedSquare);
          }
        }
        break;
      case "":
        // PROBLEMA colores son iguales
        getAttackData().forEach((attackData) => {
          if (attackData.attacker == destSquare.id && attackData.attackerColor == oppColor)
            isAttacked = true;
        });
        break;
      default:
        possibleKnightMoves.forEach((move) => {
          const piece = getSquareById(move).piece;
          if (piece.includes("N")) {
            isAttacked = true;
          }
        });
        isAttacked && defenseData.push(defendedSquare);
        break;
    }

    isEvaluatingDefense && setDefenseData(defenseData);

    return isAttacked;
  };
  const validateMoveUnderPin = (pinDirection: string, direction: string) => {
    let directions: string[] = [];
    if (["top", "bottom"].includes(pinDirection)) directions = ["top", "bottom"];
    else if (["left", "right"].includes(pinDirection)) directions = ["left", "right"];
    else if (["tr", "bl"].includes(pinDirection)) directions = ["tr", "bl"];
    else if (["tl", "br"].includes(pinDirection)) directions = ["tl", "br"];
    if (!directions.includes(direction)) return false;
    return true;
  };
  const countBlockingPieces = (
    attackData: AttackData,
    origin: number,
    piece: string,
  ): [number, number | undefined] => {
    let blockingPiecesCount = 0;
    let blockingPieceSquare: number | undefined;
    let reachedLimit = false;
    let i = 0;
    while (!reachedLimit) {
      const destination = getMoveByDirection(origin, i, attackData.direction);
      if (destination < 0 || destination > 63) {
        reachedLimit = true;
        continue;
      }
      const destSquare = getSquareById(destination);
      if (
        (origin != attackData.attacker || destSquare.piece != piece) &&
        destSquare.piece != "" &&
        destSquare.piece.charAt(1) != "K"
      ) {
        blockingPieceSquare = destSquare.id;
        blockingPiecesCount++;
      }

      if (destination == attackData.limit || destSquare.piece.charAt(1) == "K") reachedLimit = true;

      i++;
    }

    return [blockingPiecesCount, blockingPieceSquare];
  };
  const cleanPinnedPieces = () => {
    let data = getAttackData() as AttackData[];

    data.forEach((attackData, i) => {
      const coinsidingLimit = { direction: attackData.direction, limit: attackData.limit };
      const [blockingPiecesCount] = countBlockingPieces(
        coinsidingLimit as AttackData,
        attackData.attacker,
        "",
      );
      const attackerOldSquare = getSquareById(attackData.attacker);
      const attackerColorInitial = attackerOldSquare.piece.charAt(0);
      const defendantColorInitial = attackData.defendant
        ? getSquareById(attackData.defendant).piece.charAt(0)
        : null;

      attackData.isPinBlocked = blockingPiecesCount > 1;
      if (attackerOldSquare.piece == "" || attackerColorInitial == defendantColorInitial) {
        let pinnedPieces = getAttackData();
        pinnedPieces.splice(i, 1);
        setAttackData(pinnedPieces);
      }
    });
  };
  const addAtacker = (
    attackData: AttackData | undefined,
    piece: string,
    destSquare: Record<string, any>,
    isBlocked: boolean,
    origin: number,
    direction?: Direction,
    limit?: number,
  ) => {
    attackData = {
      direction: direction as Direction,
      limit: limit,
      attacker: origin,
      attackerColor: piece.charAt(0),
      defendant: undefined,
      king: destSquare.id,
      isPinBlocked: false,
      isCheck: !isBlocked,
      isPin: undefined,
    };
    if (direction === undefined) {
      const pinnedPieces = getAttackData();
      pinnedPieces.push(attackData);
      setAttackData(pinnedPieces);
      cleanAttackData();
      return attackData;
    }
    // Se cuentan piezas bloqueando
    let [blockingPiecesCount, blockingPieceSquare] = countBlockingPieces(attackData, origin, piece);
    attackData.defendant = blockingPieceSquare;
    attackData.isPin = blockingPiecesCount == 1;

    // Se asegura que no se dupliquen los registros cuando selecciono una pieza
    let isAttackerRepeated = false;

    getAttackData().forEach((aD) => {
      if (!attackData) return;
      isAttackerRepeated =
        aD.attacker == attackData.attacker && aD.direction == attackData.direction;
    });

    // Decide si incluir coinsidingLimit
    if (blockingPiecesCount < 2 && !isAttackerRepeated) {
      const pinnedPieces = getAttackData();
      pinnedPieces.push(attackData);
      setAttackData(pinnedPieces);
    }

    cleanAttackData();

    return attackData;
  };
  const checkIsAttackerPinning = (
    // origin de attacker, dest es del rey
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
      destSquare.piece.charAt(0) == piece.charAt(0)
      // !isBlocked
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

    const descendingDirections: Direction[] = ["top", "left", "tr", "tl"];
    const ascendingDirections: Direction[] = ["bottom", "right", "br", "bl"];
    let directions = origin > destSquare.id ? descendingDirections : ascendingDirections;
    let attackData: AttackData | undefined;

    const [knightPossibleMoves] = calculateKnight(origin, piece, false, true, true, false);

    // Reviso si rey y atacante comparten row, col o diag
    directions.forEach((direction) => {
      if (kLimits[direction] == aLimits[direction]) {
        attackData = addAtacker(
          attackData,
          piece,
          destSquare,
          isBlocked,
          origin,
          direction,
          kLimits[direction],
        );
      }
    });

    knightPossibleMoves.forEach((move) => {
      const destPiece = getSquareById(move).piece;
      if (destPiece.charAt(1) === "K" && destPiece.charAt(0) !== piece.charAt(0)) {
        attackData = addAtacker(attackData, piece, destSquare, isBlocked, origin);
      }
    });

    return attackData;
  };
  const checkIsDefendantPinned = (
    //
    isBlocked: boolean,
  ) => {
    const attackData = getAttackData();
    for (let i = 0; i < attackData.length; i++) {
      const attack = attackData[i];
      if (attack.isCheck) {
        const attackerSquare = getSquareById(attack.attacker);
        const kingSquare = getSquareById(attack.king);
        const pinRes = checkIsAttackerPinning(
          attack.attacker,
          kingSquare,
          attackerSquare.piece,
          isBlocked,
        );
        if (pinRes?.isPin) break;
      }
    }
    attackData.forEach((attack) => {});
  };
  const checkHasKingMoved = (attackData: AttackData[]): AttackData[] => {
    return attackData.filter((attack) => {
      if (!attack.isCheck) return true;

      const kingSquare = getSquareById(attack.king);
      return kingSquare.piece.charAt(1) === "K";
    });
  };
  const checkCanDefend = (piece: string) => {
    // Si oponente esta en check, reviso si la pieza seleccionada puede bloquear el check
    let canDefend = false;
    let attackData = getAttackData() as AttackData[];

    attackData = checkHasKingMoved(attackData);
    setAttackData(attackData as [AttackData]);

    attackData.forEach((attack) => {
      // Reviso todos los attackData, veo si estan registrando un check
      // Reviso si la pieza evaluada es oponente del atacante
      if (attack.isCheck && attack.attackerColor != piece.charAt(0)) {
        canDefend = checkPossibleDefenses(attack, true);
      }
    });

    return canDefend;
  };
  const checkPossibleDefenses = (
    attack: AttackData,
    isEvaluatingDefense: boolean,
    isEvaluatingCheck?: boolean,
  ) => {
    // Reviso la linea de ataque del atacante
    // Reviso si alguna pieza del defensor esta atacando ese square
    // Paro cuando alcanzo al rey defensor
    let canDefend = false;

    for (let i = 0; i < 7; i++) {
      if (!attack.direction || (!attack.limit && attack.limit !== 0)) return canDefend;
      const move = getMoveByDirection(attack.attacker, i, attack.direction);
      const square = getSquareById(move);
      if (square.piece.includes("K")) break;

      const kingColor = getSquareById(attack.king).piece.charAt(0);
      const kingPiece = kingColor == "w" ? "bK" : "wK";
      canDefend = calculateIsSquareBeingAttacked(
        move,
        kingPiece,
        isEvaluatingDefense,
        isEvaluatingCheck || false,
      );
    }
    return canDefend;
  };
  // Global Cals
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
    isEvaluatingDefense: boolean,
    isEvaluatingCheck: boolean,
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
      if (
        piece.charAt(1) == "K" &&
        calculateIsSquareBeingAttacked(destSquare.id, piece, isEvaluatingDefense, isEvaluatingCheck)
      )
        if (destSquare.piece.charAt(1) != "K") isAttacked = true;
      // if (!isEvaluatingCheck && destSquare.piece.charAt(1) != "K") isAttacked = true;
      // Decide si debe interpretar este square como isBeingAttacked
    } else if (recursionLayer == 1) {
      // Evalua si el cuadro esta siendo atacado
      if (
        piece.charAt(1) == "K" &&
        piece.charAt(0) != destSquare.piece.charAt(0) &&
        evaluateIsBeingAttacked(
          origin,
          destSquare,
          isEvaluatingDefense || false,
          isEvaluatingCheck,
          piece,
        )
      ) {
        if (destSquare.piece.charAt(1) != "K") isAttacked = true;
        // if (!isEvaluatingCheck && destSquare.piece.charAt(1) != "K") isAttacked = true;
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

    // Revisar estados de ataques
    const attackData = getAttackData();
    for (let i = 0; i < attackData.length; i++) {
      const pd = attackData[i];

      // Revisar que moves puede hacer un defensor pinned
      if (!pd.isPinBlocked && pd.defendant == origin) {
        if (!validateMoveUnderPin(pd.direction, direction)) {
          return false;
        }
      }

      // Revisar si el color de esta pieza esta en check

      let canEatAttacker = false;
      if (pd.attacker == destSquare.id) canEatAttacker = true;

      if (
        pd.isCheck &&
        pd.attackerColor != piece.charAt(0) &&
        piece.charAt(1) !== "K" &&
        !canEatAttacker
      ) {
        const defenseData = getDefenseData();
        let canDefend = false;

        for (let i = 0; i < defenseData.length; i++) {
          const defense = defenseData[i];
          if (defense.id == destSquare.id) canDefend = true;
        }
        if (!canDefend) return false;
      }
    }

    // si el color de la pieza que se movera es esta bajo check, verificar si puede defender y si no retornar false

    return true;
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
    isEvaluatingDefense,
    isEvaluatingCheck,
    possibleMoves,
    recursionLayer,
    extras,
  }: EvalSquareParam): [number[], boolean, boolean, boolean] => {
    const isIndexDecreacing = ["tr", "tl", "top", "left"].includes(direction);
    let move = getMoveByDirection(origin, i, direction);
    let limit = isLimit[direction] as number;
    // Calcula que el move siendo calculado este dentro del tablero
    if (isIndexDecreacing && move < limit) return [possibleMoves, isCheck, isAttacked, isPin];
    if (!isIndexDecreacing && move > limit) return [possibleMoves, isCheck, isAttacked, isPin];
    // Evalua si el atacante esta viendo al rey
    const destSquare = getSquareById(move);

    if (piece.charAt(1) != "K" && !isEvaluatingDefense) {
      isCalcMoves && cleanPinnedPieces();
      isCalcMoves && checkIsDefendantPinned(isBlocked[direction]);
      checkIsAttackerPinning(origin, destSquare, piece, isBlocked[direction]);
    }

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
      isEvaluatingDefense,
      isEvaluatingCheck,
      isBlocked,
      direction,
    );

    const isValid = runValidations(destSquare, piece, isAttacked, origin, extras, direction);

    if (!isValid) return [possibleMoves, isCheck, isAttacked, isPin];

    possibleMoves.push(move);
    return [possibleMoves, isCheck, isAttacked, isPin];
  };
  const calculateLinearMoves = (
    origin: number,
    piece: string,
    isCalcMoves: boolean,
    isEvaluatingDefense: boolean,
    isEvaluatingCheck: boolean,
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

    if (piece.charAt(1) != "K" && !isEvaluatingDefense && !isEvaluatingCheck) {
      isCalcMoves && checkCanDefend(piece);
    }

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
          isEvaluatingDefense,
          isEvaluatingCheck,
          recursionLayer: 0,
          possibleMoves,
        });
      });
    }
    return [possibleMoves, isCheck, isAttacked];
  };
  const calculateKnight = (
    origin: number,
    piece: string,
    isCalcMoves: boolean,
    isEvaluatingDefense: boolean,
    isEvaluatingCheck: boolean,
    needDefense: boolean,
    recursionLayer?: number,
  ): [number[], boolean] => {
    recursionLayer = recursionLayer || 0;
    let [row, col] = getRowCol(origin);
    let possibleMoves: number[] = [];
    let isCheck = false;
    let isAttacked = false;
    let canDefend = false;

    if (col >= 1 && row >= 2) possibleMoves.push(origin - 17);
    if (col <= 6 && row >= 2) possibleMoves.push(origin - 15);

    if (col >= 2 && row >= 1) possibleMoves.push(origin - 10);
    if (col <= 5 && row >= 1) possibleMoves.push(origin - 6);

    if (col >= 2 && row <= 6) possibleMoves.push(origin + 6);
    if (col <= 5 && row <= 6) possibleMoves.push(origin + 10);

    if (col >= 1 && row <= 5) possibleMoves.push(origin + 15);
    if (col <= 6 && row <= 5) possibleMoves.push(origin + 17);

    !isEvaluatingCheck && cleanPinnedPieces();
    canDefend = needDefense && isCalcMoves && checkCanDefend(piece);
    let isInCheck = false;
    getAttackData().forEach((attackData) => {
      if (
        attackData.isCheck &&
        piece.charAt(0) != getSquareById(attackData.attacker).piece.charAt(0)
      )
        isInCheck = true;
    });

    const movesLength = possibleMoves.length;
    for (let i = 0; i < movesLength; i++) {
      const invI = movesLength - 1 - i;
      let destSquare = getSquareById(possibleMoves[invI]);

      !isEvaluatingDefense && checkIsAttackerPinning(origin, destSquare, piece, false);

      [isCheck, isAttacked] = runChecks(
        destSquare,
        piece,
        isCheck,
        0,
        isAttacked,
        origin,
        isEvaluatingDefense,
        isEvaluatingCheck,
      );

      let canEatAttacker = false;
      const attackData = getAttackData();
      for (let i = 0; i < attackData.length; i++) {
        const pd = attackData[i];

        if (pd.attacker == destSquare.id) {
          canEatAttacker = true;
          break;
        }
      }

      if (destSquare.piece.includes(piece.charAt(0)) && recursionLayer != 1 && isCalcMoves)
        possibleMoves.splice(invI, 1);
      if (destSquare.piece.includes("K")) isCheck = true;

      if (isInCheck && !isEvaluatingCheck && !canEatAttacker) {
        const defenseData = getDefenseData().map((def) => def.id);
        if (!defenseData.includes(possibleMoves[invI])) {
          possibleMoves.splice(invI, 1);
        }
      }
    }

    const pinnedOrigins = getAttackData().map((attackData) => attackData.defendant);
    if (pinnedOrigins.includes(origin)) possibleMoves = [];

    return [possibleMoves, isCheck];
  };
  const calculatePossibleMoves = (
    origin: number,
    piece: string,
    isCalcMoves: boolean,
    isEvaluatingDefense: boolean,
    isEvaluatingCheck: boolean,
  ): [number[], boolean] => {
    let possibleMoves: number[] = [];
    let isCheck: boolean = false;
    const pieceInitial = piece.charAt(1);

    switch (pieceInitial) {
      case "B":
        [possibleMoves, isCheck] = calculateLinearMoves(
          origin,
          piece,
          isCalcMoves,
          isEvaluatingDefense,
          isEvaluatingCheck,
        );
        break;
      case "R":
        [possibleMoves, isCheck] = calculateLinearMoves(
          origin,
          piece,
          isCalcMoves,
          isEvaluatingDefense,
          isEvaluatingCheck,
        );
        break;
      case "Q":
        [possibleMoves, isCheck] = calculateLinearMoves(
          origin,
          piece,
          isCalcMoves,
          isEvaluatingDefense,
          isEvaluatingCheck,
        );
        break;
      case "K":
        [possibleMoves, isCheck] = calculateLinearMoves(
          origin,
          piece,
          isCalcMoves,
          isEvaluatingDefense,
          isEvaluatingCheck,
        );
        break;
      case "N":
        [possibleMoves, isCheck] = calculateKnight(
          origin,
          piece,
          isCalcMoves,
          isEvaluatingDefense,
          isEvaluatingCheck,
          true,
        );
        break;
      case "P":
        [possibleMoves, isCheck] = calculateLinearMoves(
          origin,
          piece,
          isCalcMoves,
          isEvaluatingDefense,
          isEvaluatingCheck,
        );
        break;
    }

    isCalcMoves && setDefenseData([]);

    return [possibleMoves, isCheck];
  };
  const checkIsCheckMate = (piece: string) => {
    let isMate = false;
    let canDefend;
    let hasMoves;
    const attacks = getAttackData();
    attacks.forEach((attack) => {
      const kingSquare = getSquareById(attack.king);
      if (attack.isCheck && attack.attackerColor == piece.charAt(0)) {
        canDefend = checkPossibleDefenses(attack, true, true);
        [hasMoves] = calculatePossibleMoves(attack.king, kingSquare.piece, true, false, true);
        isMate = !canDefend && hasMoves.length == 0;
      }
    });

    if (isMate) {
      setIsCheckMate(piece.charAt(0));
    }

    return isMate;
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
    checkIsCheckMate,
  };
};
