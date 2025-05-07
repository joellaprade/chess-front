"use client";

import { signup } from "@/reusable/actions/signup";
import useFetchServerAction from "@/reusable/hooks/fetchAction";
import { multiFetch } from "@/reusable/lib/utils";
import { useEffect, useState } from "react";

export default function Page() {
  multiFetch("express", "/mail/verification", "POST", {
    email: "joellaprade1@gmail.com",
  });

  const [isValid, setIsValid] = useState(false);
  const [fData, setFData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const { data, loading, error, fetchData } = useFetchServerAction(signup);

  const updateData = (fData: any, field: string) => {
    setFData((prevState) => ({ ...prevState, [field]: fData }));
  };

  const validateFData = () => {
    const { name, email, username, password, confirmPassword } = fData;
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

  useEffect(validateFData, [fData]);
  useEffect(() => {
    if (data) window.location.href = "/";
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
          value={fData.name}
          onChange={(e) => {
            updateData(e.target.value, "name");
          }}
          name="name"
          type="text"
          placeholder="Nombre"
        />
        <input
          value={fData.email}
          onChange={(e) => {
            updateData(e.target.value.toLowerCase(), "email");
          }}
          name="email"
          type="email"
          placeholder="Correo Electrónico"
        />
        <input
          value={fData.username}
          onChange={(e) => {
            updateData(e.target.value.toLowerCase(), "username");
          }}
          name="username"
          type="text"
          placeholder="Usuario"
        />
        <input
          value={fData.password}
          onChange={(e) => {
            updateData(e.target.value, "password");
          }}
          name="password"
          type="password"
          placeholder="Contraseña"
        />
        <input
          value={fData.confirmPassword}
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
