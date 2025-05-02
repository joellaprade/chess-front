import { useEffect, useState } from "react";
import { useWs } from "./WsContext";
import { useAuth } from "./AuthContext";

const WsController = () => {
  const userId = useAuth().session?.userId;
  const wssUrl = process.env.NEXT_PUBLIC_WS_BACKEND_URL;
  const { iMsg, oMsg, setIMsg, setConnected } = useWs();
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
  useEffect(connect, []);

  return <></>;
};

export default WsController;
