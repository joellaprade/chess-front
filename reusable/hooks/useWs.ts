import { useEffect, useRef, useState } from "react";
import { useWsContext } from "../context/WsContext";
import { useAuth } from "../context/AuthContext";
import { Instruction } from "../types/instruction";
import { usePathname } from "next/navigation";

const useWs = () => {
  const userId = useAuth().session?.userId;
  const wssUrl = process.env.NEXT_PUBLIC_WS_BACKEND_URL;
  const { iMsg, oMsg, connected, setIMsg, setOMsg } = useWsContext();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const pathname = usePathname();

  const connect = () => {
    if (!userId || !wssUrl || pathname == "/login" || connected.current) return;
    connected.current = true;

    try {
      const wsRes = new WebSocket(wssUrl);
      setWs(wsRes);
      initWs(wsRes);
    } catch (e) {
      console.error(e);
    }
  };
  const close = () => {
    if (!connected.current) ws?.close();
  };
  const initWs = (ws: WebSocket) => {
    ws.onopen = () => (connected.current = true);
    ws.onclose = () => (connected.current = false);
    ws.onmessage = ({ data }: { data: string }) => {
      const message = JSON.parse(data);
      setIMsg(message);
    };
  };
  const sendMsg = () => {
    if (!ws || !oMsg) return;

    ws.send(JSON.stringify(oMsg));
  };
  const runReplyAction = (notif: Instruction) => {
    const reply = notif.replyAction;
    if (!reply) return;

    setOMsg({ ...reply });
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

  useEffect(() => console.log(iMsg), [iMsg]);
  useEffect(sendMsg, [oMsg]);
  useEffect(connect, [userId]);
  useEffect(close, [connected.current]);

  return { sendAddRequest, addFriend, handleRemoveFriend, runReplyAction };
};

export default useWs;
