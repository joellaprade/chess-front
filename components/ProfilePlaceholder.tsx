import Image from "next/image";

const ProfilePlaceholder = () => {
  return (
    <Image
      width={60}
      height={60}
      alt="Profile Picture Placeholder"
      src="/assets/profile-picture.svg"
    />
  );
};

export default ProfilePlaceholder;
