import { useEffect, useState } from "react";
import { useWsContext } from "../context/WsContext";
import { useAuth } from "../context/AuthContext";
import { Instruction } from "../types/instruction";

const useWs = () => {
  const userId = useAuth().session?.userId;
  const wssUrl = process.env.NEXT_PUBLIC_WS_BACKEND_URL;
  const { oMsg, connected, setIMsg, setOMsg, setConnected } = useWsContext();
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connect = () => {
    if (!userId || !wssUrl) return;

    try {
      const wsRes = new WebSocket(wssUrl);
      setWs(wsRes);
      initWs(wsRes);
    } catch (e) {
      console.error(e);
    }
  };
  const close = () => {
    if (!connected) ws?.close();
  };
  const initWs = (ws: WebSocket) => {
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = ({ data }: { data: string }) => {
      const message = JSON.parse(data);
      setIMsg(message);
    };
  };
  const sendMsg = () => {
    if (!ws || !oMsg) return;

    ws.send(JSON.stringify(oMsg));
  };

  // Messages
  const sendAddRequest = (username: string) => {
    setOMsg({
      action: "add-friend",
      payload: { username },
    });
  };
  const addFriend = (username: string) => {
    setOMsg({
      action: "add-friend",
      payload: { username },
    });
  };
  const handleRemoveFriend = (username: string) => {
    setOMsg({
      action: "remove-friend",
      payload: { username },
    });
  };
  const runReplyAction = (notif: Instruction) => {
    const reply = notif.replyAction;
    if (!reply) return;

    setOMsg({ ...reply });
  };

  useEffect(sendMsg, [oMsg]);
  useEffect(connect, [userId]);
  useEffect(close, [connected]);

  return { sendAddRequest, addFriend, handleRemoveFriend, runReplyAction };
};

export default useWs;
