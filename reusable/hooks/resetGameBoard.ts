"use client";
import { useGameContext } from "../context/GameContext";
import { useBoardContext } from "../context/BoardContext";
import defaultBoard from "../context/DefaultBoard";
import { AttackData } from "../types/attackData";
import { useEffect } from "react";

const useResetGameBoard = () => {
  const {
    playersData,
    isThisPlayerWhite,
    gameId,
    isSearchingForGame,
    resetted,
    setIsWin,
    setIsDraw,
    setIncommingMove,
    setResetted,
  } = useGameContext();
  const {
    selectedPieceLegalMoves,
    setIsWhiteTurn,
    setBoard,
    setSelectedSquare,
    setShowQueenPopup,
    setUpgradingPawn,
    setHasRookMove,
    setAttackData,
    setDefenseData,
  } = useBoardContext();

  const resetBoard = () => {
    selectedPieceLegalMoves.current = [];
    setIsWhiteTurn(true);
    setBoard(defaultBoard);
    setSelectedSquare(null);
    setShowQueenPopup(false);
    setUpgradingPawn(null);
    setHasRookMove({
      hasWhiteMoved: false,
      hasBlackMoved: false,
      white: {
        left: false,
        right: false,
      },
      black: {
        left: false,
        right: false,
      },
    });
    setAttackData([] as unknown as [AttackData]);
    setDefenseData([]);
  };

  const resetGame = () => {
    setIsWin("");
    setIsDraw(false);
    setIncommingMove(null);
    playersData.current = [];
    isThisPlayerWhite.current = false;
    gameId.current = null;
    isSearchingForGame.current = false;
  };

  const reset = () => {
    localStorage.setItem("board", "");
    localStorage.setItem("playerData", "");
    localStorage.setItem("isThisPlayerWhite", "");
    localStorage.setItem("gameId", "");
    localStorage.setItem("isWhiteTurn", "");
    localStorage.setItem("w-time", "");
    localStorage.setItem("b-time", "");
    resetGame();
    resetBoard();
    setResetted(true);
  };

  useEffect(() => {
    if (resetted) setResetted(false);
  }, [resetted]);

  return { resetGame, resetBoard, reset };
};

export default useResetGameBoard;
