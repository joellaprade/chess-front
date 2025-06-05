import { BoardContextProvider } from "@/reusable/context/BoardContext";

export default function BoardContextResetWrapper({
  children,
  resetKey,
}: {
  children: React.ReactNode;
  resetKey: string;
}) {
  return <BoardContextProvider key={resetKey}>{children}</BoardContextProvider>;
}
