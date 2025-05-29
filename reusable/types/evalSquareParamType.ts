import { Direction } from "./directions";

export type EvalSquareParam = {
  isBlocked: Record<Direction, boolean>;
  direction: Direction;
  origin: number;
  i: number;
  isLimit: Record<any, number>;
  piece: string;
  isCheck: boolean;
  isAttacked: boolean;
  isPin: boolean;
  isCalcMoves: boolean;
  isEvaluatingDefense: boolean;
  possibleMoves: number[];
  recursionLayer: number;
  extras?: Record<string, any>;
};
