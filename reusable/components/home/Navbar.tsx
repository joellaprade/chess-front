"use client";

import NavBg from "../ui/NavBg";
import { ChevronLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  let message;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  switch (pathname) {
    case "/signup":
      message = "Crear Cuenta";
      break;
    case "/login":
      message = "Ingresar";
      break;
    case "/friends":
      message = "Amigos";
      break;
    case "/friends/invitations":
      message = "Invitaciones";
      break;
    case "/friends/add":
      message = "Agregar Amigo";
      break;
    default:
      message = "Bienvenido";
      break;
  }

  return (
    <nav className="relative">
      <ChevronLeft className="chevron" onClick={handleBack} />
      <h1 className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center">
        {message}
      </h1>
      <NavBg className={"w-full"} />
    </nav>
  );
};

export default Navbar;
