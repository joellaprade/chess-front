import { Direction } from "./directions";
export type AttackData = {
  direction?: Direction;
  limit?: number;
  attacker: number;
  attackerColor: string;
  defendant: number | undefined;
  king: number;
  isPinBlocked: boolean;
  isCheck: boolean;
  isPin: boolean | undefined;
};
