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
  const [notification, setNotification] = useState<Instruction | null>(notif);
  const [message, setMessage] = useState<string | null>(null);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [showReplyActionBtn, setShowReplyActionBtn] = useState(false);

  const runReplyAction = () => {
    const reply = notif.replyAction;
    if (!reply) return;

    setOMsg({ ...reply });
  };

  const getMessage = () => {
    switch (notif.action) {
      case "error":
        setMessage(notif.payload.message);
        break;
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
      case "notify-only-removed-friend":
        setMessage("Se ha terminado la amistad con:");
        break;
    }
  };

  const handleNotif = () => {
    if (notif) {
      getMessage();
      setNotification(notif);
      setShowNotif(true);
      setShowProfilePic(!notif.action.includes("error"));
      setShowReplyActionBtn(!notif.action.includes("notify-only"));
      setTimeout(() => setShowNotif(false), 8000);
    } else {
      setNotification(null);
      setShowNotif(false);
      setShowProfilePic(false);
      setShowReplyActionBtn(false);
    }
  };

  useEffect(handleNotif, [notif]);

  return (
    <div className={`notification ${showNotif ? "translate-y-0" : ""} `}>
      <div className="flex items-center gap-3">
        <Image
          className={`${showProfilePic ? "" : "hidden"} profile-picture`}
          src={notification?.payload.image || "/assets/profile-picture.svg"}
          alt={notification?.payload.username || "Profile Picture"}
          width={60}
          height={60}
        />
        <div className="flex h-full flex-col justify-center">
          <span className="text-gray-400">{message}</span>
          <h3>{notification?.payload.username}</h3>
        </div>
      </div>
      <div className={`flex items-center gap-3`}>
        <button
          onClick={() => {
            runReplyAction();
            setShowNotif(false);
          }}
          className={`${showReplyActionBtn ? "" : "hidden"} bg-green small-btn`}
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
