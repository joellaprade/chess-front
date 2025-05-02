"use client";

import { Check } from "lucide-react";
import { X } from "lucide-react";
import ProfilePlaceholder from "./ProfilePlaceholder";
import Image from "next/image";
import { useNotifications } from "@/reusable/context/NotificationContext";
import { useEffect, useState } from "react";

type notifType = {
  username: string;
  image: string;
};

const Notification = () => {
  const notif = useNotifications().notif as notifType;
  const [username, setUsername] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [showNotif, setShowNotif] = useState(true);

  useEffect(() => {
    console.log(notif, showNotif);
    if (notif) {
      setUsername(notif.username);
      setImage(notif.image);
      setShowNotif(true);
    } else {
      setUsername(null);
      setImage(null);
      setShowNotif(false);
    }
  }, [notif]);

  return (
    <div className={`notification ${showNotif ? "translate-y-0" : ""} `}>
      <div className="flex items-center gap-3">
        <Image
          src={image || "/assets/profile-picture.svg"}
          alt={username || "Profile Picture"}
          width={60}
          height={60}
        />
        <h3>{username}</h3>
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
