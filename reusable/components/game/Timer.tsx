import { useBoardContext } from "@/reusable/context/BoardContext";
import { useGameContext } from "@/reusable/context/GameContext";
import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Timer = ({ isWhite }: { isWhite: boolean }) => {
  const [time, setTime] = useState(600);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);
  const { isWhiteTurn } = useBoardContext();
  const { incommingMove } = useGameContext();

  const turnSecondsIntoMinutes = (totalTime: number) => {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const handleSwitchTimes = () => {
    if (isWhiteTurn == isWhite) {
      timer.current = setInterval(() => {
        setTime((prevState) => prevState - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer.current);
    };
  };
  const handleTimeSync = () => {
    const color = isWhite ? "w" : "b";
    const updatedTime = incommingMove?.payload.times[`${color}Time`];

    if (!updatedTime) return;

    setTime(updatedTime);
  };

  useEffect(handleTimeSync, [incommingMove]);
  useEffect(handleSwitchTimes, [isWhiteTurn]);

  return (
    <div
      className={`${isWhite ? "bg-white" : "&& bg-black text-white"} ${isWhite == isWhiteTurn ? "" : "opacity-30"} timer`}
    >
      {isWhite == isWhiteTurn ? <Clock /> : <div className="h-[24px] w-[24px]" />}
      <span>{turnSecondsIntoMinutes(time)}</span>
    </div>
  );
};

export default Timer;
