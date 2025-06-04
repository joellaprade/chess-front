"use client";

import { Check } from "lucide-react";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Instruction } from "@/reusable/types/instruction";
import useWs from "@/reusable/hooks/useWs";
import useHomePage from "@/reusable/hooks/useHomePage";
import { useHomePageContext } from "@/reusable/context/HomePageContext";

const Notification = () => {
  useHomePage();
  const { notificationHandler } = useHomePageContext();
  const { runReplyAction } = useWs();
  const [notification, setNotification] = useState<Instruction | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [showReplyActionBtn, setShowReplyActionBtn] = useState(false);

  const setInstructionMessage = (instruction: Instruction) => {
    switch (instruction.action) {
      case "notify-only-error":
        setMessage(instruction.payload.message);
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
      case "notify-game-request":
        setMessage("Solicitud de juego de:");
        break;
    }
  };

  const handleNotification = (instruction: Instruction) => {
    if (instruction) {
      setInstructionMessage(instruction);
      setNotification(instruction);
      setShowNotif(instruction.action.includes("notify"));
      setShowProfilePic(!instruction.action.includes("error"));
      setShowReplyActionBtn(!instruction.action.includes("notify-only"));
      setTimeout(() => setShowNotif(false), 8000);
    } else {
      setNotification(null);
      setShowNotif(false);
      setShowProfilePic(false);
      setShowReplyActionBtn(false);
    }
  };

  useEffect(() => {
    notificationHandler.current = handleNotification;
  }, []);

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
            runReplyAction(notification || ({} as Instruction));
            setShowNotif(false);
          }}
          className={`${showReplyActionBtn ? "" : "hidden"} bg-green small-btn`}
        >
          <Check />
        </button>
        <button onClick={() => setShowNotif(false)} className="small-btn bg-red-400">
          <X />
        </button>
      </div>
    </div>
  );
};

export default Notification;
