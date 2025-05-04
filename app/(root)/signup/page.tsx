"use client";

import { signup } from "@/reusable/actions/signup";
import useFetchServerAction from "@/reusable/hooks/fetchAction";
import { useEffect, useState } from "react";

export default function Page() {
  const [isValid, setIsValid] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const { loading, error, fetchData } = useFetchServerAction(signup);

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
      <form
        action={(formData: FormData) => {
          fetchData(formData);
        }}
        className="w-full"
      >
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
            updateData(e.target.value.toLowerCase(), "email");
          }}
          name="email"
          type="email"
          placeholder="Correo Electrónico"
        />
        <input
          value={data.username}
          onChange={(e) => {
            updateData(e.target.value.toLowerCase(), "username");
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
        <span className="error">{error}</span>
        <button
          type={`${isValid && !loading ? "submit" : "button"}`}
          className={`big-btn main-btn mt-5 transition-opacity duration-300 ${isValid && !loading ? "" : "opacity-50"}`}
        >
          {loading ? "Enviando..." : "Crear Cuenta"}
        </button>
      </form>
    </>
  );
}
