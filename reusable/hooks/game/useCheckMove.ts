"use client";

import { useBoardUtils } from "./useBoardUtils";
import { useCheckRook } from "./useCheckRook";

export const useCheckMove = () => {
  const { getSquareById } = useBoardUtils();
  const { checkRook } = useCheckRook();

  const checkMove = (origin: number, destination: number) => {
    let isValid = false;
    const piece = getSquareById(origin).piece.charAt(1);

    switch (piece) {
      case "P":
        isValid = true;
        break;
      case "R":
        isValid = checkRook(origin, destination);
        break;
      case "N":
        isValid = true;
        break;
      case "B":
        isValid = true;
        break;
      case "Q":
        isValid = true;
        break;
      case "K":
        isValid = true;
        break;
    }

    return isValid;
  };
  const handleWrongMove = () => {};

  return { checkMove, handleWrongMove };
};
