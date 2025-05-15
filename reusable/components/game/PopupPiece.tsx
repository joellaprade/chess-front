import Image from "next/image";

const PopupPiece = ({
  piece,
  onClick,
}: {
  piece: string;
  onClick: (p: string) => void;
}) => {
  return (
    <div onClick={() => onClick(piece)} className="piece-container">
      <Image
        src={`/assets/pieces/${piece}.png`}
        width={50}
        height={50}
        alt="piece"
      />
    </div>
  );
};

export default PopupPiece;
