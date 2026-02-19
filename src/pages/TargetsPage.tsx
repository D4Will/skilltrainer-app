import Target from "../components/Target";
import Button from "../components/Button";
import { useRef, useState, useEffect } from "react";
import { submitTargetScore } from "../endpoints/api";

const TargetsPage = () => {
  type gameStatus = "not started" | "started" | "ended";
  type targetPosition = {
    xPos: number;
    yPos: number;
  };

  const [gameStatus, setGameStatus] = useState<gameStatus>("not started");
  const [targetAmount, setTargetAmount] = useState<number>(30);
  const [targetCounter, setTargetCounter] = useState<number>(0);
  const [timePerTarget, setTimePerTarget] = useState<number>(0);
  const [targetPos, setTargetPos] = useState<targetPosition>({
    xPos: 45,
    yPos: 45,
  });

  const totalClicksRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);

  function incrementClicks(): void {
    totalClicksRef.current = totalClicksRef.current + 1;
  }

  useEffect(() => {
    if (gameStatus === "ended") {
      submitTargetScore(
        totalTimeRef.current,
        totalClicksRef.current,
        targetAmount,
      );

      setTimePerTarget(totalTimeRef.current / targetAmount);
      setTargetPos({
        xPos: 45,
        yPos: 30,
      });
    }
  }, [gameStatus]);

  return (
    <>
      <div className="target-game-window" onClick={incrementClicks}>
        {gameStatus === "not started" && (
          <>
            <div className="target-button-group">
              <Button
                className="target-selector"
                activeClassName="target-selector-active"
                onClick={() => setTargetAmount(15)}
                isActive={targetAmount === 15}
              >
                15 Targets
              </Button>
              <Button
                className="target-selector"
                activeClassName="target-selector-active"
                onClick={() => setTargetAmount(30)}
                isActive={targetAmount === 30}
              >
                30 Targets
              </Button>
              <Button
                className="target-selector"
                activeClassName="target-selector-active"
                onClick={() => setTargetAmount(45)}
                isActive={targetAmount === 45}
              >
                45 Targets
              </Button>
            </div>
            <div className="target-game-area">
              <div className="game-info">
                <p>Press the target to begin the game</p>
              </div>
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
            <div className="game-info">
              <p>Remaining targets: {targetAmount - targetCounter}</p>
            </div>
            <Target
              style={{ left: targetPos.xPos + "%", top: targetPos.yPos + "%" }}
              onClick={() => {
                setTargetPos({
                  xPos: Math.floor(Math.random() * 40) + 30,
                  yPos: Math.floor(Math.random() * 60),
                });
                setTargetCounter(() => targetCounter + 1);

                if (targetCounter === targetAmount - 1) {
                  totalClicksRef.current += 1;
                  totalTimeRef.current = Date.now() - startTimeRef.current;
                  setGameStatus("ended");
                }
              }}
            />
          </div>
        )}
        {gameStatus === "ended" && (
          <>
            <div className="target-button-group">
              <Button
                className="target-selector"
                activeClassName="target-selector-active"
                onClick={() => setTargetAmount(15)}
                isActive={targetAmount === 15}
              >
                15 Targets
              </Button>
              <Button
                className="target-selector"
                activeClassName="target-selector-active"
                onClick={() => setTargetAmount(30)}
                isActive={targetAmount === 30}
              >
                30 Targets
              </Button>
              <Button
                className="target-selector"
                activeClassName="target-selector-active"
                onClick={() => setTargetAmount(45)}
                isActive={targetAmount === 45}
              >
                45 Targets
              </Button>
            </div>
            <div className="target-game-area">
              <div className="game-info">
                <p>You took {timePerTarget.toFixed(1)}ms per target</p>
                <p>Press the target to play again</p>
              </div>
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

export default TargetsPage;
