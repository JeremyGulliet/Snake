import { useEffect, useRef, useState, useCallback } from "react";
import { IoSkullOutline } from "react-icons/io5";

const canvasWidth = 900;
const canvasHeight = 600;
const blockSize = 30;
const delay = 100;
const widthInBlocks = canvasWidth / blockSize;
const heightInBlocks = canvasHeight / blockSize;

const Game = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([
    [6, 4],
    [5, 4],
    [4, 4],
    [3, 4],
    [2, 4],
  ]);
  const [direction, setDirection] = useState("right");
  const [apple, setApple] = useState([10, 10]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const drawScore = useCallback(
    (ctx) => {
      ctx.save();
      ctx.font = "bold 70px sans-serif";
      ctx.fillStyle = "gray";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const centreX = canvasWidth / 2;
      const centreY = canvasHeight / 2;
      ctx.fillText(score.toString(), centreX, centreY);
      ctx.restore();
    },
    [score]
  );

  const getRandomApplePosition = useCallback((snakeBody) => {
    let position;
    do {
      const newX = Math.round(Math.random() * (widthInBlocks - 1));
      const newY = Math.round(Math.random() * (heightInBlocks - 1));
      position = [newX, newY];
    } while (
      snakeBody.some(
        (block) => block[0] === position[0] && block[1] === position[1]
      )
    );
    return position;
  }, []);

  const checkCollision = useCallback((head, body) => {
    const [snakeX, snakeY] = head;
    const wallCollision =
      snakeX < 0 ||
      snakeX >= widthInBlocks ||
      snakeY < 0 ||
      snakeY >= heightInBlocks;
    const snakeCollision = body
      .slice(1)
      .some((block) => block[0] === snakeX && block[1] === snakeY);
    return wallCollision || snakeCollision;
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const newSnake = [...snake];
    let newHead = [...newSnake[0]];

    switch (direction) {
      case "left":
        newHead[0] -= 1;
        break;
      case "right":
        newHead[0] += 1;
        break;
      case "up":
        newHead[1] -= 1;
        break;
      case "down":
        newHead[1] += 1;
        break;
      default:
        break;
    }

    newSnake.unshift(newHead);

    if (newHead[0] === apple[0] && newHead[1] === apple[1]) {
      setScore(score + 1);
      setApple(getRandomApplePosition(newSnake));
    } else {
      newSnake.pop();
    }

    if (checkCollision(newHead, newSnake)) {
      setGameOver(true);
    } else {
      setSnake(newSnake);
    }

    // Dessiner le serpent
    ctx.fillStyle = "green";
    snake.forEach(([x, y]) => {
      ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    });

    // Dessiner la pomme
    ctx.fillStyle = "red";
    ctx.fillRect(
      apple[0] * blockSize,
      apple[1] * blockSize,
      blockSize,
      blockSize
    );

    // Dessiner le score
    drawScore(ctx);
  }, [
    snake,
    direction,
    apple,
    checkCollision,
    drawScore,
    score,
    getRandomApplePosition,
  ]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(drawCanvas, delay);
      return () => clearInterval(timer);
    }
  }, [drawCanvas, gameStarted, gameOver]);

  const restart = useCallback(() => {
    setSnake([
      [6, 4],
      [5, 4],
      [4, 4],
      [3, 4],
      [2, 4],
    ]);
    setDirection("right");
    setApple(
      getRandomApplePosition([
        [6, 4],
        [5, 4],
        [4, 4],
        [3, 4],
        [2, 4],
      ])
    );
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  }, [getRandomApplePosition]);

  const handleKeyDown = useCallback(
    (e) => {
      let newDirection;
      switch (e.keyCode) {
        case 37:
          newDirection = "left";
          break;
        case 38:
          newDirection = "up";
          break;
        case 39:
          newDirection = "right";
          break;
        case 40:
          newDirection = "down";
          break;
        case 32:
          restart();
          return;
        case 13:
          setGameStarted(true);
          return;
        default:
          return;
      }
      setDirection(newDirection);
    },
    [restart]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col items-center justify-center ">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        // style={{
        //   border: "30px solid gray",
        //   margin: "50px auto",
        //   display: "block",
        //   backgroundColor: "#ddd",
        //       }}
        className="border-8 border-solid border-slate-600  my-8 mx-auto bg-white"
      />
      {gameOver && (
        <div className="flex flex-col absolute bottom-40 left-50 w-auto h-auto p-4 bg-green-200 items-center justify-center rounded-lg border-slate-600 border-2 border-solid">
          <div className="flex items-center justify-center">
            <IoSkullOutline className="m-2 text-2xl" />
            <h1 className="text-2xl font-bold">Game Over</h1>
            <IoSkullOutline className="m-2 text-2xl" />
          </div>
          <p>Appuyer sur la touche espace pour rejouer</p>
        </div>
      )}
      {!gameStarted && !gameOver && (
        <div className="flex flex-col absolute bottom-40 left-50 w-auto h-auto p-4 bg-green-200 items-center justify-center rounded-lg border-slate-600 border-2 border-solid">
          <h1>Appuyez sur Entrée pour commencer</h1>
        </div>
      )}
    </div>
  );
};

export default Game;
