import Image from "next/image";

type Props = {
  username: string;
  image: string;
};

const UserProfile = ({ username, image }: Props) => {
  return (
    <div className="mt-5 flex items-center gap-5">
      <Image
        src={image}
        alt="profile-preview"
        width={75}
        height={75}
        className="aspect-square rounded-full object-cover"
      />
      <h3>{username}</h3>
    </div>
  );
};

export default UserProfile;
