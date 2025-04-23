import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="bg-dark-brown h-25 w-full"></div>
      <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-6 px-10">
        {children}
      </div>
    </>
  );
}
