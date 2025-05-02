"use client";
import { useEffect } from "react";
import { useNotifications } from "./NotificationContext";
import { useWs } from "./WsContext";

const NotificationController = () => {
  const { notif, setNotif } = useNotifications();
  const { iMsg } = useWs();

  useEffect(() => setNotif(iMsg), [iMsg]);

  return <></>;
};

export default NotificationController;
