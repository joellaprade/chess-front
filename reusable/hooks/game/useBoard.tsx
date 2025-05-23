"use client";

import QueenPopup from "@/reusable/components/game/QueenPopup";
import { useBoardContext } from "../../context/BoardContext";
import { useBoardUtils } from "./useBoardUtils";
import { useCheckMove } from "./useCheckMove";

const useBoard = () => {
  const {
    selectedSquare,
    selectedPieceLegalMoves,
    isWhiteTurn,
    showQueenPopup,
    upgradingPawn,
    setBoard,
    setSelectedSquare,
    setSelectedPieceLegalMoves,

  } = useBoardContext();
  const { calculateLegalMoves, validateMove, handleWrongMove } = useCheckMove();
  const { getSquareById } = useBoardUtils();

  const colorLegalSquares = (id: number) => {
    if (!selectedSquare) return "";
    if (selectedPieceLegalMoves.includes(id)) return "valid-square-indicator";
  };
  const handleMove = (movingPiece: string, destination: number) => {
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
  const movePiece = (destination: number) => {
    const movingPiece = getSquareById(selectedSquare!).piece;

    const isMoveValid = validateMove(selectedSquare!, destination);
    if (!isMoveValid) return handleWrongMove();

    handleMove(movingPiece, destination);
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
  const renderQueenPopup = () => {
    return (
      showQueenPopup && (
        <QueenPopup
          color={isWhiteTurn ? "w" : "b"}
          destination={upgradingPawn!}
        />
      )
    );
  };

  return {
    getSquareById,
    movePiece,
    getColor,
    handlePieceClick,
    colorLegalSquares,
    renderQueenPopup,
    handleMove,
  };
};

export default useBoard;
