"use client";
import { useGameContext } from "../context/GameContext";
import { useBoardContext } from "../context/BoardContext";
import defaultBoard from "../context/DefaultBoard";
import { AttackData } from "../types/attackData";

const useResetGameBoard = () => {
  const { playersData, isThisPlayerWhite, gameId, isSearchingForGame, setIsHydrated } =
    useGameContext();
  const {
    selectedPieceLegalMoves,
    isWhiteTurn,
    setIsCheckMate,
    setBoard,
    setSelectedSquare,
    setShowQueenPopup,
    setUpgradingPawn,
    setHasRookMove,
    setAttackData,
    setDefenseData,
  } = useBoardContext();

  const reset = () => {
    // Board
    console.log(selectedPieceLegalMoves);
    selectedPieceLegalMoves.current = [];
    isWhiteTurn.current = true;
    setIsCheckMate("");
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

    // Game
    playersData.current = [];
    isThisPlayerWhite.current = false;
    gameId.current = null;
    isSearchingForGame.current = false;
    setIsHydrated(false);

    // Local Storage
    localStorage.setItem("playerData", "");
    localStorage.setItem("isThisPlayerWhite", "");
    localStorage.setItem("gameId", "");
    localStorage.setItem("board", "");
    localStorage.setItem("isWhiteTurn", "");
  };

  return reset;
};

export default useResetGameBoard;
