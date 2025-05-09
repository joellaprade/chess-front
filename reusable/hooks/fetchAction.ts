import { useState } from "react";

export default function useFetchServerAction<T>(
  serverAction: (formData: FormData) => Promise<T>, // Make sure the function signature matches
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (formData: FormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 5));
    try {
      const res = await serverAction(formData);
      setData(res);
    } catch (e: any) {
      if (e.message == "NEXT_REDIRECT") return;
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchData };
}
