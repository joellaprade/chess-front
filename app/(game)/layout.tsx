import GameOptions from "@/reusable/components/game/GameOptions";
import { BoardContextProvider } from "@/reusable/context/BoardContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-col">
      <BoardContextProvider>
        <div className="bg-dark-brown flex w-full items-center justify-end px-10 py-3">
          <GameOptions />
        </div>
        <div className="relative flex min-h-0 grow flex-col items-center justify-center">
          {children}
        </div>
      </BoardContextProvider>
    </div>
  );
}
