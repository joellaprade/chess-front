import { Direction } from "./directions";

export type IsBlocked = {
  tl: boolean;
  tr: boolean;
  br: boolean;
  bl: boolean;
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
};

export type Limit = Record<Direction, number | null>;
