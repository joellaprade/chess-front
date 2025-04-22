import { Check } from "lucide-react";
import { X } from "lucide-react";
import ProfilePlaceholder from "./ProfilePlaceholder";

const Notification = () => {
  return (
    <div className="notification">
      <div className="flex items-center gap-3">
        <ProfilePlaceholder />
        <h3>Usuario</h3>
      </div>
      <div className="flex items-center gap-3">
        <button className="bg-green small-btn">
          <Check />
        </button>
        <button className="small-btn bg-red-400">
          <X />
        </button>
      </div>
    </div>
  );
};

export default Notification;
