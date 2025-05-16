import Board from "@/reusable/components/game/Board";
import User from "@/reusable/components/game/User";

const Game = () => {
  const gameData: gameDataType = {
    players: [
      {
        username: "Joel",
        isBlack: false,
      },
      {
        username: "Miguel",
        isBlack: true,
      },
    ],
    time: 60 * 10,
  };

  const thisPlayer = gameData.players[0];
  const oponent = gameData.players[1];

  return (
    <div className="game">
      <User user={oponent} />
      <Board isBlack={thisPlayer.isBlack} />
      <User user={thisPlayer} />
    </div>
  );
};

export default Game;
