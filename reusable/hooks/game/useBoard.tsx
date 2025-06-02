"use client";

import QueenPopup from "@/reusable/components/game/QueenPopup";
import { useBoardContext } from "../../context/BoardContext";
import { useBoardUtils } from "./useBoardUtils";
import { useCheckMove } from "./useCheckMove";
import useGameWs from "./useGameWs";
import { useEffect } from "react";
import { Instruction } from "@/reusable/types/instruction";
import { useGameContext } from "@/reusable/context/GameContext";

const useBoard = () => {
  const { incommingMove, sendMove } = useGameWs();
  const {
    board,
    selectedSquare,
    selectedPieceLegalMoves,
    isWhiteTurn,
    showQueenPopup,
    upgradingPawn,
    setBoard,
    setSelectedSquare,
  } = useBoardContext();
  const { calculateLegalMoves, validateMove, handleWrongMove } = useCheckMove();
  const { getSquareById } = useBoardUtils();
  const { isThisPlayerWhite } = useGameContext();

  const handleOppMove = (instruction: Instruction | null) => {
    if (!instruction) return;
    const { origin, destination } = instruction.payload;
    const movingPiece = getSquareById(origin).piece;
    selectedPieceLegalMoves.current = calculateLegalMoves(origin);

    const isValid = validateMove(origin, destination);
    if (isValid) {
      handleMove(movingPiece, destination, origin);
    }
  };

  const colorLegalSquares = (id: number) => {
    if (selectedSquare != 0 && !selectedSquare) return "";
    if (selectedPieceLegalMoves.current.includes(id)) return "valid-square-indicator";
    return "";
  };
  const handleMove = (movingPiece: string, destination: number, origin?: number) => {
    if (!origin) origin = selectedSquare!;
    setBoard((prevBoard) =>
      prevBoard.map((row) =>
        row.map((square) => {
          if (square.id === origin) {
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

    sendMove(selectedSquare!, destination);
    handleMove(movingPiece, destination);
  };
  const getColor = (id: number) => {
    let row = Math.floor(id / 8);
    let [evenColor, oddColor] = row % 2 == 0 ? ["white", "green"] : ["green", "white"];
    let color = id % 2 == 0 ? evenColor : oddColor;

    color = selectedSquare == id ? "yellow" : color;

    return color;
  };
  const handlePieceClick = ({ id: index, piece }: { id: number; code: string; piece: string }) => {
    const allowedColor = isThisPlayerWhite.current ? "w" : "b";
    const targetSquareColor = piece.charAt(0);
    console.log(piece.charAt(0));
    console.log(allowedColor);
    if (targetSquareColor !== "" && targetSquareColor !== allowedColor) return;
    if (selectedSquare === null) {
      setSelectedSquare(index);
      selectedPieceLegalMoves.current = calculateLegalMoves(index);
    } else if (index === selectedSquare) {
      setSelectedSquare(null);
      selectedPieceLegalMoves.current = [];
    } else if (getSquareById(selectedSquare).piece !== "") {
      movePiece(index);
      selectedPieceLegalMoves.current = [];
      setSelectedSquare(null);
    } else {
      selectedPieceLegalMoves.current = [];
      setSelectedSquare(null);
    }
  };
  const renderQueenPopup = () => {
    return (
      showQueenPopup && <QueenPopup color={isWhiteTurn ? "w" : "b"} destination={upgradingPawn!} />
    );
  };

  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(board));
  }, [board]);
  useEffect(() => {
    handleOppMove(incommingMove);
  }, [incommingMove]);

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
