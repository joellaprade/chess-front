import { Player } from "@/reusable/models/Player";
import PlayerComponent from "./PlayerComponent";

type Props = {
  reqs: Player[];
};

const GameReqList = ({ reqs }: Props) => {
  return <div className="friend-list">{/* <PlayerComponent /> */}</div>;
};

export default GameReqList;
