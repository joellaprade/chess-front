import { useBoardContext } from "@/reusable/context/BoardContext";

const GameEnded = () => {
  const { isCheckMate } = useBoardContext();
  const winner = isCheckMate == "w" ? "White" : "Black";
  return (
    <div className="game-ended-bg">
      <div className="game-ended">{winner} wins!</div>
    </div>
  );
};

export default GameEnded;
