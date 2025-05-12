"use client";

import { useBoardContext } from "../../context/BoardContext";
import { useBoardUtils } from "./useBoardUtils";
import { useCheckMove } from "./useCheckMove";

const useBoard = () => {
  const {
    selectedSquare,
    selectedPieceLegalMoves,
    setBoard,
    setSelectedSquare,
    setSelectedPieceLegalMoves,
  } = useBoardContext();
  const { calculateLegalMoves, validateMove, handleWrongMove } = useCheckMove();
  const { getSquareById } = useBoardUtils();

  const colorLegalSquares = (id: number) => {
    if (!selectedSquare) return "";
    if (selectedPieceLegalMoves.includes(id)) return "opacity-50";
  };
  const movePiece = (destination: number) => {
    const movingPiece = getSquareById(selectedSquare!).piece;

    const isMoveValid = validateMove(selectedSquare!, destination);
    if (!isMoveValid) return handleWrongMove();

    setBoard((prevBoard) =>
      prevBoard.map((row) =>
        row.map((square) => {
          if (square.id === selectedSquare) {
            // remove selected piece
            return { ...square, piece: "" };
          } else if (square.id === destination) {
            // replace piece on destination
            return { ...square, piece: movingPiece };
          } else {
            return square;
          }
        }),
      ),
    );
  };
  const getColor = (id: number) => {
    let row = Math.floor(id / 8);
    let [evenColor, oddColor] =
      row % 2 == 0 ? ["white", "green"] : ["green", "white"];
    let color = id % 2 == 0 ? evenColor : oddColor;

    color = selectedSquare == id ? "yellow" : color;

    return color;
  };
  const handlePieceClick = (index: number) => {
    if (selectedSquare === null) {
      setSelectedSquare(index);
      setSelectedPieceLegalMoves(calculateLegalMoves(index));
    } else if (index === selectedSquare) {
      setSelectedSquare(null);
    } else if (getSquareById(selectedSquare).piece !== "") {
      movePiece(index);
      setSelectedSquare(null);
    } else {
      setSelectedSquare(null);
    }
  };

  return {
    getSquareById,
    movePiece,
    getColor,
    handlePieceClick,
    colorLegalSquares,
  };
};

export default useBoard;
