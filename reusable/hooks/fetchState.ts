"use client";

import { useState } from "react";
import { multiFetch } from "@/reusable/lib/utils";

export const useFetchState = <T>(
  server: "express" | "nextjs",
  url: string,
  reqType?: "GET" | "POST" | "PUT" | "DELETE",
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (e: any, body?: object | FormData) => {
    e.preventDefault();
    setIsLoading(true);
    multiFetch<T>(server, url, reqType, body)
      .then((res) => setData(res))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  };

  return { data, isLoading, error, fetchData };
};
