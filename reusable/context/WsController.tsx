import { useEffect, useState } from "react";
import { useWs } from "./WsContext";
import { useAuth } from "./AuthContext";

const WsController = () => {
  const userId = useAuth().session?.userId;
  const wssUrl = process.env.NEXT_PUBLIC_WS_BACKEND_URL;
  const { oMsg, connected, setIMsg, setConnected } = useWs();
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

  useEffect(sendMsg, [oMsg]);
  useEffect(connect, [userId]);
  useEffect(close, [connected]);

  return <></>;
};

export default WsController;
