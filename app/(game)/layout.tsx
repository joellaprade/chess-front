import { BoardContextProvider } from "@/reusable/context/BoardContext";
import { Ellipsis } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full flex-col">
      <BoardContextProvider>
        <div className="bg-dark-brown flex w-full items-center justify-end px-10 py-3">
          <Ellipsis className="h-10 w-10 text-white" />
        </div>
        <div className="relative flex min-h-0 grow flex-col items-center justify-center">
          {children}
        </div>
      </BoardContextProvider>
    </div>
  );
}
