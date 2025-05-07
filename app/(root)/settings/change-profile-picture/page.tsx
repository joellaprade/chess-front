"use client";

import UploadInput from "@/reusable/components/ui/UploadInput";
import { useState } from "react";
import { useFetchState } from "@/reusable/hooks/fetchState";
import { useAuth } from "@/reusable/context/AuthContext";
import UserProfile from "@/reusable/components/home/UserProfile";
import { useRouter } from "next/navigation";

export default function Page() {
  const { session } = useAuth();
  const router = useRouter();

  if (!session) {
    return router.push("/");
  }

  const currentProfilePicture = session.user.image;
  const username = session.user.username;
  const [formData, setFormData] = useState<FormData | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { isLoading, error, fetchData } = useFetchState(
    "express",
    "/file-manager/upload",
    "POST",
  );

  const setFile = (pFile: File) => {
    const filePreview = URL.createObjectURL(pFile);
    const fileToFormData = new FormData();
    fileToFormData.append("upload-input", pFile);
    setFormData(fileToFormData);
    setImagePreview(filePreview);
  };

  return (
    <div className="mt-30 flex w-full flex-1 flex-col items-start">
      <h2>Sube tu foto de perfil:</h2>
      <UploadInput className="mt-5" getFile={setFile} />
      {imagePreview ? (
        <>
          <UserProfile username={username} image={imagePreview} />
          <button
            onClick={(e) => fetchData(e, formData)}
            className={`main-btn big-btn mt-20 transition-opacity duration-300 ${isLoading ? "opacity-50" : ""}`}
            type={isLoading ? "button" : "submit"}
          >
            {isLoading ? "Enviando..." : "Enviar"}
          </button>
          <span className="error">{error}</span>
        </>
      ) : (
        <UserProfile
          username={username}
          image={
            currentProfilePicture ||
            "https://res.cloudinary.com/dd86ogsbh/image/upload/v1746553576/fnm2du6brktixowpusgd.svg"
          }
        />
      )}
    </div>
  );
}
