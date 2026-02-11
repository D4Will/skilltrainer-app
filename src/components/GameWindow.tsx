import Target from "./Target";
import GameInfo from "./GameInfo";
import Button from "./Button";
import { useRef, useState } from "react";
import { submitTargetScore } from "../endpoints/api";

const GameWindow = () => {
  type gameStatus = "not started" | "started" | "ended";
  type targetPosition = {
    xPos: number;
    yPos: number;
  };

  const [gameStatus, setGameStatus] = useState<gameStatus>("not started");
  const [targetAmount, setTargetAmount] = useState<number>(30);
  const [targetCounter, setTargetCounter] = useState<number>(0);
  const [targetPos, setTargetPos] = useState<targetPosition>({
    xPos: 45,
    yPos: 45,
  });
  const [timePerTarget, setTimePerTarget] = useState<number>(0);

  const totalClicksRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);

  function incrementClicks(): void {
    totalClicksRef.current = totalClicksRef.current + 1;
  }

  return (
    <>
      <div className="gameWindow" onClick={incrementClicks}>
        {gameStatus === "not started" && (
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
                style={{
                  left: targetPos.xPos + "%",
                  top: targetPos.yPos + "%",
                }}
                onClick={() => {
                  setGameStatus("started");
                  setTargetPos({
                    xPos: Math.floor(Math.random() * 40) + 30,
                    yPos: Math.floor(Math.random() * 60),
                  });
                  startTimeRef.current = Date.now();
                  totalClicksRef.current = 0;
                }}
              />
            </div>
          </>
        )}
        {gameStatus === "started" && (
          <div className="target-game-area">
            <GameInfo>
              <p>Remaining targets: {targetAmount - targetCounter}</p>
            </GameInfo>
            <Target
              style={{ left: targetPos.xPos + "%", top: targetPos.yPos + "%" }}
              onClick={() => {
                setTargetPos({
                  xPos: Math.floor(Math.random() * 40) + 30,
                  yPos: Math.floor(Math.random() * 60),
                });
                setTargetCounter(targetCounter + 1);

                if (targetCounter === targetAmount - 1) {
                  totalTimeRef.current = Date.now() - startTimeRef.current;
                  submitTargetScore(
                    totalTimeRef.current,
                    totalClicksRef.current + 1,
                    targetAmount,
                  );
                  setGameStatus("ended");
                  setTimePerTarget(totalTimeRef.current / targetAmount);
                  setTargetPos({
                    xPos: 45,
                    yPos: 30,
                  });
                }
              }}
            />
          </div>
        )}
        {gameStatus === "ended" && (
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
                <p>You took {timePerTarget.toFixed(1)}ms per target</p>
                <p>Press the target to play again</p>
              </GameInfo>
              <Target
                style={{
                  left: targetPos.xPos + "%",
                  top: targetPos.yPos + "%",
                }}
                onClick={() => {
                  setGameStatus("started");
                  setTargetPos({
                    xPos: Math.floor(Math.random() * 40) + 30,
                    yPos: Math.floor(Math.random() * 60),
                  });
                  setTargetCounter(0);
                  totalClicksRef.current = 0;
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
