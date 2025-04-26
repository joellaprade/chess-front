"use client";

import UploadInput from "@/components/ui/UploadInput";
import { useState } from "react";
import Image from "next/image";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const getFile = (pFile: File) => {
    const filePreview = URL.createObjectURL(pFile);
    setFile(pFile);
    setImagePreview(filePreview);
  };

  return (
    <div className="mt-30 flex w-full flex-1 flex-col items-start">
      <h2>Sube tu foto de perfil:</h2>
      <UploadInput className="mt-5" getFile={getFile} />

      {imagePreview && (
        <div className="mt-5 flex items-center gap-5">
          <Image
            src={`${imagePreview}`}
            alt="profile-preview"
            width={75}
            height={75}
            className="aspect-square rounded-full object-cover"
          />
          <h3>Username</h3>
        </div>
      )}
    </div>
  );
}
