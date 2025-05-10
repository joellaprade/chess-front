import { useBoardContext } from "../context/BoardContext";

const useBoard = () => {
  const { board, setBoard, selectedSquare, setSelectedSquare } =
    useBoardContext();

  const getSquareById = (index: number) => {
    const row = Math.floor(index / 8);
    const rowSquare = index - row * 8;

    return board[row][rowSquare];
  };
  const movePiece = (destination: number) => {
    const movingPiece = getSquareById(selectedSquare!).piece;

    setBoard((prevBoard) =>
      prevBoard.map((row) =>
        row.map((square) => {
          if (square.id === selectedSquare) {
            // remove selected piece
            return { ...square, piece: "" };
          } else if (square.id === destination) {
            // replace piece on destination
            return { ...square, piece: movingPiece };
          } else {
            return square;
          }
        }),
      ),
    );
  };
  const getColor = (id: number) => {
    let row = Math.floor(id / 8);
    let [evenColor, oddColor] =
      row % 2 == 0 ? ["white", "green"] : ["green", "white"];
    let color = id % 2 == 0 ? evenColor : oddColor;

    color = selectedSquare == id ? "yellow" : color;

    return color;
  };
  const handlePieceClick = (index: number) => {
    if (selectedSquare === null) {
      setSelectedSquare(index);
    } else if (index === selectedSquare) {
      setSelectedSquare(null);
    } else if (getSquareById(selectedSquare).piece !== "") {
      movePiece(index);
      setSelectedSquare(null);
    } else {
      setSelectedSquare(null);
    }
  };

  return { getSquareById, movePiece, getColor, handlePieceClick };
};

export default useBoard;
