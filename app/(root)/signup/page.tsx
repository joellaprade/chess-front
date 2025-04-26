import { signUp } from "@/reusable/actions/signUp";

export default async function Page() {
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signUp({ name: "ee" });
        }}
        className="w-full"
      >
        <input id="name" name="name" type="text" placeholder="Nombre" />
        <input name="email" type="text" placeholder="Correo Electrónico" />
        <input name="username" type="text" placeholder="Usuario" />
        <input name="password" type="text" placeholder="Contraseña" />
        <input type="text" placeholder="Confirmar Contraseña" />
        <button className="big-btn main-btn mt-5">Crear Cuenta</button>
      </form>
    </>
  );
}
