import Navbar from "@/components/Navbar";
import Notification from "../../components/Notification";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Notification />
      <Navbar />
      <div className="flex w-full flex-1 flex-col justify-center gap-6 px-10">
        {children}
      </div>
    </>
  );
}
