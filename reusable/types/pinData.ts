import { Direction } from "./directions";
export type PinData = {
  direction: Direction;
  limit: number;
  attacker: number;
  pinned: number | undefined;
  isPinBlocked: boolean;
};
