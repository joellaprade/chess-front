import Navbar from "@/reusable/components/home/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-6 px-10">
        {children}
      </div>
    </>
  );
}
