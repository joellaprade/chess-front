"use client";

import { Check } from "lucide-react";
import { X } from "lucide-react";
import Image from "next/image";
import { useNotifications } from "@/reusable/context/NotificationContext";
import { useEffect, useState } from "react";
import { Instruction } from "@/reusable/types/instruction";
import { useWs } from "@/reusable/context/WsContext";

const Notification = () => {
  const { setOMsg } = useWs();
  const notif = useNotifications().notif as Instruction;
  const [username, setUsername] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showNotif, setShowNotif] = useState(false);

  const runReplyAction = () => {
    const reply = notif.replyAction;
    if (!reply) return;

    setOMsg({ ...reply });
  };

  const getMessage = () => {
    switch (notif.action) {
      case "notify-friend-request":
        setMessage("Solicitud de amistad de:");
        break;
      case "notify-only-new-friend":
        setMessage("Nueva amistad con:");
        break;
      case "notify-only-is-online":
        setMessage("Se ha conectado:");
        break;
      case "notify-only-is-not-online":
        setMessage("Se ha desconectado:");
        break;
    }
  };

  useEffect(() => {
    if (notif) {
      setUsername(notif.payload.username);
      setImage(notif.payload.image);
      setShowNotif(true);
      getMessage();
      const timeout = setTimeout(() => setShowNotif(false), 8000);
      return () => clearTimeout(timeout);
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
          className="profile-picture"
          src={image || "/assets/profile-picture.svg"}
          alt={username || "Profile Picture"}
          width={60}
          height={60}
        />
        <div className="flex h-full flex-col justify-center">
          <span className="text-gray-400">{message}</span>
          <h3>{username}</h3>
        </div>
      </div>
      <div className={`flex items-center gap-3`}>
        <button
          onClick={() => {
            runReplyAction();
            setShowNotif(false);
          }}
          className={`${notif?.action.includes("only") ? "hidden" : ""} bg-green small-btn`}
        >
          <Check />
        </button>
        <button
          onClick={() => setShowNotif(false)}
          className="small-btn bg-red-400"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default Notification;
