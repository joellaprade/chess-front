import NavBg from "../ui/NavBg";
import { headers } from "next/headers";
import ChevronBtn from "../ui/ChevronBtn";
import { getSession } from "@/reusable/lib/auth";

const Navbar = async () => {
  const session = await getSession();
  const allHeaders = await headers();
  const pathname = allHeaders.get("x-pathname");
  let message;
  // console.log(pathname);

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
    default:
      message = "Bienvenido";
      break;
  }

  return (
    <nav className="relative">
      <ChevronBtn />
      <h1 className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center">
        {message}
      </h1>
      <NavBg className={"w-full"} />
    </nav>
  );
};

export default Navbar;
