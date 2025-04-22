import Image from "next/image";
import ProfilePlaceholder from "./ProfilePlaceholder";

const Friend = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ProfilePlaceholder />
        <h3>Usuario</h3>
      </div>
      <button className="small-btn bg-green">
        <Image
          src={"/assets/small-pawn.png"}
          alt="small pawn"
          width={20}
          height={20}
        />
      </button>
    </div>
  );
};

export default Friend;
