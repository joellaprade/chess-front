import { BoardContextProvider } from "@/reusable/context/BoardContext";
import { Ellipsis } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BoardContextProvider>
        <div className="bg-dark-brown flex h-25 w-full items-center justify-end px-10">
          <Ellipsis className="h-10 w-10 text-white" />
        </div>
        <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-6">
          {children}
        </div>
      </BoardContextProvider>
    </>
  );
}
