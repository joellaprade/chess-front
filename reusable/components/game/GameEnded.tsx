import { useBoardContext } from "@/reusable/context/BoardContext";
import { useGameContext } from "@/reusable/context/GameContext";
import useHomePage from "@/reusable/hooks/useHomePage";
import Link from "next/link";

const GameEnded = () => {
  const { requestGameToFriend } = useHomePage();
  const { isCheckMate } = useBoardContext();
  const winner = isCheckMate == "w" ? "White" : "Black";
  const { playersData, isThisPlayerWhite } = useGameContext();

  const handleRematch = () => {
    const oponent = playersData.current[isThisPlayerWhite.current ? 1 : 0];
    requestGameToFriend(oponent.playerId);
  };

  return (
    <div className="game-ended-bg">
      <div className="game-ended">
        <h2>{winner} wins!</h2>
        <div className="flex w-full grow-1 flex-col justify-center gap-10">
          <Link href="/home" className="w-full">
            <button className="big-btn bg-green">Volver a Inicio</button>
          </Link>
          <button onClick={handleRematch} className="big-btn bg-green">
            Otro Juego
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEnded;
