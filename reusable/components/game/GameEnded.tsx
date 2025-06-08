import { useGameContext } from "@/reusable/context/GameContext";
import useGameWs from "@/reusable/hooks/game/useGameWs";
import Link from "next/link";

const GameEnded = () => {
  const { requestGameToFriend } = useGameWs();
  const { playersData, isThisPlayerWhite, isCheckMate, isDraw } = useGameContext();
  const winner = isCheckMate == "w" ? "Blancas" : "Negras";

  const handleRematch = () => {
    const oponent = playersData.current[isThisPlayerWhite.current ? 1 : 0];
    requestGameToFriend(oponent.playerId);
  };

  return (
    <div className="game-ended-bg">
      <div className="game-ended">
        {isCheckMate && <h2 className="text-center">Las Piezas {winner} ganan!</h2>}
        {isDraw && <h2 className="text-center">Juego terminado por tregua</h2>}
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
