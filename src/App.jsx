import { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";

const canvasWidth = 900;
const canvasHeight = 600;
const blockSize = 30;
const delay = 100;
const widthInBlocks = canvasWidth / blockSize;
const heightInBlocks = canvasHeight / blockSize;

const drawBlock = (ctx, position, color) => {
  const x = position[0] * blockSize;
  const y = position[1] * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};

const Snake = ({ body, ctx }) => {
  useEffect(() => {
    if (ctx) {
      ctx.save();
      body.forEach((block) => drawBlock(ctx, block, "#ff0000"));
      ctx.restore();
    }
  }, [body, ctx]);

  return null;
};

Snake.propTypes = {
  body: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  ctx: PropTypes.object,
};

const Apple = ({ position, ctx }) => {
  useEffect(() => {
    if (ctx) {
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      const radius = blockSize / 2;
      const x = position[0] * blockSize + radius;
      const y = position[1] * blockSize + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    }
  }, [position, ctx]);

  return null;
};

Apple.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  ctx: PropTypes.object,
};

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

  const drawApple = useCallback((ctx, position) => {
    ctx.save();
    ctx.fillStyle = "#33cc33";
    ctx.beginPath();
    const radius = blockSize / 2;
    const x = position[0] * blockSize + radius;
    const y = position[1] * blockSize + radius;
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();
  }, []);

  const drawSnake = useCallback((ctx, body) => {
    ctx.save();
    ctx.fillStyle = "#ff0000";
    body.forEach((block) => drawBlock(ctx, block, "#ff0000"));
    ctx.restore();
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

  const refreshCanvas = useCallback(() => {
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
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
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      drawApple(ctx, apple);
      drawSnake(ctx, newSnake);
      drawScore(ctx);
      setSnake(newSnake);
    }
  }, [
    snake,
    direction,
    apple,
    score,
    getRandomApplePosition,
    drawScore,
    drawApple,
    drawSnake,
    checkCollision,
  ]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setTimeout(refreshCanvas, delay);
      return () => clearTimeout(timer);
    }
  }, [refreshCanvas, gameStarted, gameOver]);
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
    setGameStarted(false); // Réinitialiser le démarrage du jeu
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
          return; // Touche Entrée
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
    <div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          border: "30px solid gray",
          margin: "50px auto",
          display: "block",
          backgroundColor: "#ddd",
        }}
      />
      {gameOver && (
        <div style={{ textAlign: "center" }}>
          <h1>Game Over</h1>
          <p>Appuyer sur la touche espace pour rejouer</p>
        </div>
      )}
      {!gameStarted && !gameOver && (
        <div style={{ textAlign: "center" }}>
          <h1>Appuyez sur Entrée pour commencer</h1>
        </div>
      )}
    </div>
  );
};

const App = () => (
  <div className="bg-blue-300 flex items-center justify-center h-screen w-screen">
    <Game />
  </div>
);

export default App;