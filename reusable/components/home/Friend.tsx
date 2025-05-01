import Image from "next/image";

type Props = {
  username: string;
  image: string;
  func: (username: string) => void;
};

const Friend = ({ username, image, func }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          className="profile-picture"
          width={60}
          height={60}
          alt="profile-picture"
          src={image || "/assets/profile-picture.svg"}
        />
        <h3>{username}</h3>
      </div>
      <button onClick={() => func(username)} className="small-btn bg-green">
        <Image
          src={"/assets/pawn-icon.png"}
          alt="small pawn"
          width={20}
          height={20}
          className="object-contains"
        />
      </button>
    </div>
  );
};

export default Friend;
