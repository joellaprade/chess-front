"use client";

import QueenPopup from "@/reusable/components/game/QueenPopup";
import { useBoardContext } from "../../context/BoardContext";
import { useBoardUtils } from "./useBoardUtils";
import { useCheckMove } from "./useCheckMove";
import useGameWs from "./useGameWs";
import { useEffect } from "react";
import { Instruction } from "@/reusable/types/instruction";
import { useGameContext } from "@/reusable/context/GameContext";
import GameEnded from "@/reusable/components/game/GameEnded";

const useBoard = () => {
  const { sendMove } = useGameWs();
  const {
    board,
    selectedSquare,
    selectedPieceLegalMoves,
    isWhiteTurn,
    showQueenPopup,
    upgradingPawn,
    setIsWhiteTurn,
    setBoard,
    setSelectedSquare,
  } = useBoardContext();
  const { calculateLegalMoves, validateMove, handleWrongMove } = useCheckMove();
  const { getSquareById } = useBoardUtils();
  const { isThisPlayerWhite, isWin, isDraw, incommingMove } = useGameContext();

  const handleOppMove = (instruction: Instruction) => {
    const { origin, destination } = instruction.payload;
    const movingPiece = getSquareById(origin).piece;
    selectedPieceLegalMoves.current = calculateLegalMoves(origin);

    const isValid = validateMove(origin, destination);
    if (isValid) {
      setIsWhiteTurn(!isWhiteTurn);
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

    setIsWhiteTurn(!isWhiteTurn);
    handleMove(movingPiece, destination);
    sendMove(selectedSquare!, destination);
  };
  const getColor = (id: number) => {
    let row = Math.floor(id / 8);
    let [evenColor, oddColor] = row % 2 == 0 ? ["white", "green"] : ["green", "white"];
    let color = id % 2 == 0 ? evenColor : oddColor;

    color = selectedSquare == id ? "yellow" : color;

    return color;
  };
  const handlePieceClick = ({ id: index, piece }: { id: number; code: string; piece: string }) => {
    const isThisPlayersTurn = isThisPlayerWhite.current === isWhiteTurn;
    const originSquareColor = getSquareById(selectedSquare || index).piece.charAt(0);
    const thisPlayerColor = isThisPlayerWhite.current ? "w" : "b";
    const isThisPlayersPiece = originSquareColor == thisPlayerColor;

    if (!isThisPlayersTurn || !isThisPlayersPiece) return;

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
  const renderGameEnded = () => {
    return (isWin || isDraw) && <GameEnded />;
  };

  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("isWhiteTurn", JSON.stringify(isWhiteTurn));
  }, [board]);
  useEffect(() => {
    if (!incommingMove) return;
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
    renderGameEnded,
  };
};

export default useBoard;
