import { Clock } from "lucide-react";
import ProfilePlaceholder from "../home/ProfilePlaceholder";

const User = ({ user }: { user: gameUser }) => {
  return (
    <div className="user">
      <div className="flex items-center gap-5">
        <ProfilePlaceholder />
        <h3>{user.username}</h3>
      </div>
      <div className="timer">
        <Clock />
        <span>4:30</span>
      </div>
    </div>
  );
};

export default User;
