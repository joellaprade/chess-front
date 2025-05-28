import { Direction } from "./directions";
export type PinData = {
  direction: Direction;
  limit: number;
  attacker: number;
  defendant: number | undefined;
  king: number;
  isPinBlocked: boolean;
  isCheck: boolean;
};
