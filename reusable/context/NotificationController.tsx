"use client";
import { useEffect } from "react";
import { useNotifications } from "./NotificationContext";
import { useWsContext } from "./WsContext";

const NotificationController = () => {
  const { notif, setNotif } = useNotifications();
  const { iMsg } = useWsContext();

  useEffect(() => setNotif(iMsg), [iMsg]);

  return <></>;
};

export default NotificationController;
