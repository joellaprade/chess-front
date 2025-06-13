"use client";

import NavBg from "../ui/NavBg";
import { usePathname } from "next/navigation";
import { useAuth } from "@/reusable/context/AuthContext";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const Navbar = () => {
  const { session } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  let message;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  switch (pathname) {
    case "/home":
      message = `Bienvenido, ${session?.user.name}`;
      break;
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
    case "/settings":
      message = "Ajustes";
      break;
    case "/settings/change-profile-picture":
      message = "Cambiar Foto de Perfil";
      break;
    case "/about":
      message = "Acerca del App";
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
