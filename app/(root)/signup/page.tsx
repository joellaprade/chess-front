export default function Page() {
  return (
    <>
      <form className="w-full" action="">
        <input type="text" placeholder="Nombre de Usuario" />
        <input type="text" placeholder="Correo Electrónico" />
        <input type="text" placeholder="Contraseña" />
        <input type="text" placeholder="Confirmar Contraseña" />
        <button className="big-btn main-btn mt-5">Crear Cuenta</button>
      </form>
    </>
  );
}
