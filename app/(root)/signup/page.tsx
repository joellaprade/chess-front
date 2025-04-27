"use client";

import { signUp } from "@/reusable/actions/signUp";
import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [isValid, setIsValid] = useState(false);

  const updateData = (data: any, field: string) => {
    setData((prevState) => ({ ...prevState, [field]: data }));
  };

  const validateData = () => {
    const { name, email, username, password, confirmPassword } = data;
    if (
      !name ||
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword
    ) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
  };

  useEffect(() => {
    validateData();
  }, [data]);

  return (
    <>
      <form action={signUp} className="w-full">
        <input
          value={data.name}
          onChange={(e) => {
            updateData(e.target.value, "name");
          }}
          name="name"
          type="text"
          placeholder="Nombre"
        />
        <input
          value={data.email}
          onChange={(e) => {
            updateData(e.target.value, "email");
          }}
          name="email"
          type="email"
          placeholder="Correo Electrónico"
        />
        <input
          value={data.username}
          onChange={(e) => {
            updateData(e.target.value, "username");
          }}
          name="username"
          type="text"
          placeholder="Usuario"
        />
        <input
          value={data.password}
          onChange={(e) => {
            updateData(e.target.value, "password");
          }}
          name="password"
          type="password"
          placeholder="Contraseña"
        />
        <input
          value={data.confirmPassword}
          onChange={(e) => {
            updateData(e.target.value, "confirmPassword");
          }}
          type="password"
          placeholder="Confirmar Contraseña"
        />
        <button
          type={`${isValid ? "submit" : "button"}`}
          className={`big-btn main-btn mt-5 transition-opacity duration-300 ${isValid ? "" : "opacity-50"}`}
        >
          Crear Cuenta
        </button>
      </form>
    </>
  );
}
