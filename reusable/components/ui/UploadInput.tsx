"use client";

type props = { getFile: (pFile: File) => void; className?: string };

const UploadInput = ({ getFile, className }: props) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      getFile(uploadedFile);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="file"
        className="absolute h-full cursor-pointer opacity-0"
        id="file-upload"
        onChange={handleFileChange}
      />
      <button className="big-btn main-btn">Subir Foto</button>
    </div>
  );
};

export default UploadInput;
