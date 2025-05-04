import { Player } from "@/reusable/models/Player";
import Friend from "./Friend";

type Props = {
  reqs: Player[];
};

const GameReqList = ({ reqs }: Props) => {
  return (
    <div className="friend-list">
      <Friend />
    </div>
  );
};

export default GameReqList;
