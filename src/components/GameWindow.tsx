import Target from "./Target";
import GameInfo from "./GameInfo";
import Button from "./Button";
import { useRef, useState } from "react";
import { submitTargetScore } from "../endpoints/api";

const GameWindow = () => {
  const [targetAmount, setTargetAmount] = useState(30);
  const [targetCounter, setTargetCounter] = useState(0);
  const totalClicksRef = useRef(0);
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const startTimeRef = useRef(0);
  const totalTimeRef = useRef(0);
  const timePerTargetRef = useRef(0);

  function updateTotalClicksRef(
    clicks: number = totalClicksRef.current + 1,
  ): void {
    totalClicksRef.current = clicks;
  }

  function updateTimePerTargetRef(ms: number): void {
    timePerTargetRef.current = ms;
  }

  function getTimePerTargetRef(): number {
    return timePerTargetRef.current;
  }

  return (
    <>
      <div
        className="gameWindow"
        onClick={() => {
          updateTotalClicksRef();
        }}
      >
        {!gameStarted && targetCounter === 0 && (
          <>
            <div className="target-button-group">
              <Button
                onClick={() => setTargetAmount(15)}
                isActive={targetAmount === 15}
              >
                15 Targets
              </Button>
              <Button
                onClick={() => setTargetAmount(30)}
                isActive={targetAmount === 30}
              >
                30 Targets
              </Button>
              <Button
                onClick={() => setTargetAmount(45)}
                isActive={targetAmount === 45}
              >
                45 Targets
              </Button>
            </div>
            <div className="target-game-area">
              <GameInfo>
                <p>Press the target to begin the game</p>
              </GameInfo>
              <Target
                style={{ left: "45%", top: "45%" }}
                onClick={() => {
                  setGameStarted(true);
                  setXPos(Math.floor(Math.random() * 40) + 30);
                  setYPos(Math.floor(Math.random() * 60));
                  setTargetCounter(0);
                  totalClicksRef.current = 0;
                  startTimeRef.current = Date.now();
                }}
              />
            </div>
          </>
        )}
        {gameStarted && targetCounter < targetAmount - 1 && (
          <div className="target-game-area">
            <GameInfo>
              <p>Remaining targets: {targetAmount - targetCounter}</p>
            </GameInfo>
            <Target
              style={{ left: xPos + "%", top: yPos + "%" }}
              onClick={() => {
                setXPos(Math.floor(Math.random() * 40) + 30);
                setYPos(Math.floor(Math.random() * 60));
                setTargetCounter((prevTargetCounter) => prevTargetCounter + 1);
              }}
            />
          </div>
        )}
        {targetCounter === targetAmount - 1 && (
          <div className="target-game-area">
            <GameInfo>
              <p>Remaining targets: {targetAmount - targetCounter}</p>
            </GameInfo>
            <Target
              style={{ left: xPos + "%", top: yPos + "%" }}
              onClick={() => {
                setXPos(Math.floor(Math.random() * 40) + 30);
                setYPos(Math.floor(Math.random() * 60));
                setTargetCounter((prevTargetCounter) => prevTargetCounter + 1);
                updateTotalClicksRef();
                updateTotalClicksRef();
                totalTimeRef.current = Date.now() - startTimeRef.current;
                submitTargetScore(
                  totalTimeRef.current,
                  totalClicksRef.current,
                  targetAmount,
                  1,
                );
                setGameEnded(true);
                setGameStarted(false);
                updateTimePerTargetRef(totalTimeRef.current / targetAmount);
              }}
            />
          </div>
        )}
        {gameEnded && (
          <>
            <div className="target-button-group">
              <Button
                onClick={() => setTargetAmount(15)}
                isActive={targetAmount === 15}
              >
                15 Targets
              </Button>
              <Button
                onClick={() => setTargetAmount(30)}
                isActive={targetAmount === 30}
              >
                30 Targets
              </Button>
              <Button
                onClick={() => setTargetAmount(45)}
                isActive={targetAmount === 45}
              >
                45 Targets
              </Button>
            </div>
            <div className="target-game-area">
              <GameInfo>
                <p>You took {getTimePerTargetRef().toFixed(0)}ms per target</p>
                <p>Press the target to play again</p>
              </GameInfo>
              <Target
                style={{ left: "45%", top: "30%" }}
                onClick={() => {
                  setGameStarted(true);
                  setGameEnded(false);
                  setXPos(Math.floor(Math.random() * 40) + 30);
                  setYPos(Math.floor(Math.random() * 60));
                  setTargetCounter(0);
                  updateTotalClicksRef(0);
                  startTimeRef.current = Date.now();
                }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GameWindow;
