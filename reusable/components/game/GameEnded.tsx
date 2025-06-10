import { useGameContext } from "@/reusable/context/GameContext";
import useGameWs from "@/reusable/hooks/game/useGameWs";
import Link from "next/link";
import { useEffect } from "react";

const GameEnded = () => {
  const { requestGameToFriend, gameEndedMessage } = useGameWs();
  const { playersData, isThisPlayerWhite, isWin, isDraw } = useGameContext();
  const winner = isWin == "w" ? "Blancas" : "Negras";

  const handleRematch = () => {
    const oponent = playersData.current[isThisPlayerWhite.current ? 1 : 0];
    requestGameToFriend(oponent.playerId);
  };

  useEffect(() => {
    gameEndedMessage();
  }, []);

  return (
    <div className="game-ended-bg">
      <div className="game-ended">
        {isWin && <h2 className="text-center">Las Piezas {winner} ganan!</h2>}
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
