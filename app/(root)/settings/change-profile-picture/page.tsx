"use client";

import UploadInput from "@/reusable/components/ui/UploadInput";
import { useState } from "react";
import Image from "next/image";
import { useFetchState } from "@/reusable/hooks/fetchState";
import { useAuth } from "@/reusable/context/AuthContext";

export default function Page() {
  const { session } = useAuth();
  const currentProfilePicture = session?.user?.image;
  const username = session?.user?.username;
  const [formData, setFormData] = useState<FormData | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data, isLoading, error, fetchData } = useFetchState(
    "express",
    "/file-manager/upload",
    "POST",
  );

  const getFile = (pFile: File) => {
    const filePreview = URL.createObjectURL(pFile);
    const fileToFormData = new FormData();
    fileToFormData.append("upload-input", pFile);
    setFormData(fileToFormData);
    setImagePreview(filePreview);
  };

  return (
    <div className="mt-30 flex w-full flex-1 flex-col items-start">
      <h2>Sube tu foto de perfil:</h2>
      <UploadInput className="mt-5" getFile={getFile} />

      {imagePreview ? (
        <>
          <div className="mt-5 flex items-center gap-5">
            <Image
              src={imagePreview}
              alt="profile-preview"
              width={75}
              height={75}
              className="aspect-square rounded-full object-cover"
            />
            <h3>{username}</h3>
          </div>
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
        <div className="mt-5 flex items-center gap-5">
          <Image
            src={currentProfilePicture || "/assets/profile-picture.svg"}
            alt="profile-preview"
            width={75}
            height={75}
            className="aspect-square rounded-full object-cover"
          />
          <h3>{username}</h3>
        </div>
      )}
    </div>
  );
}
