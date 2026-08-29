import Target from "../components/Target";
import Button from "../components/Button";
import { useRef, useState, useEffect, useEffectEvent } from "react";
import { submitTargetScore } from "../endpoints/api";
import { useAuth } from "../contexts/useAuth";

const TargetsPage = () => {
  const auth = useAuth();

  type gameStatus = "not started" | "started" | "ended";
  type loadStatus = "not saved" | "saving" | "saved";
  type targetPosition = {
    xPos: number;
    yPos: number;
  };

  const [gameStatus, setGameStatus] = useState<gameStatus>("not started");
  const [targetAmount, setTargetAmount] = useState<number>(30);
  const [targetCounter, setTargetCounter] = useState<number>(0);
  const [targetPos, setTargetPos] = useState<targetPosition>({
    xPos: 47,
    yPos: 45,
  });
  const [loadStatus, setLoadStatus] = useState<loadStatus>("not saved");

  const [timePerTarget, setTimePerTarget] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [clicks, setClicks] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  const totalClicksRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);

  const onMouseDown = useEffectEvent(() => {
    if (gameStatus === "started") {
      totalClicksRef.current = totalClicksRef.current + 1;
      console.log(totalClicksRef.current);
    }
  });

  useEffect(() => {
    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    if (gameStatus === "ended") {
      setLoadStatus("not saved");

      const accuracy =
        Math.round((targetAmount / totalClicksRef.current) * 100 * 10) / 10;
      const seconds = Math.round((totalTimeRef.current / 1000) * 10) / 10;

      setTimePerTarget(Math.round(totalTimeRef.current / targetAmount));
      setClicks(totalClicksRef.current);
      setAccuracy(accuracy);
      setTime(seconds);

      setTargetPos({
        xPos: 47,
        yPos: 45,
      });
    }
  }, [gameStatus]);

  async function saveScore(): Promise<void> {
    setLoadStatus("saving");

    await submitTargetScore(
      totalTimeRef.current,
      totalClicksRef.current,
      targetAmount,
    );

    setLoadStatus("saved");
  }

  return (
    <>
      {gameStatus === "not started" && (
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
      )}
      <div className="target-game-window">
        {gameStatus === "not started" && (
          <>
            <div className="target-game-info">
              <p>Press the target to begin the game</p>
            </div>
            <Target
              style={{
                left: targetPos.xPos + "%",
                top: targetPos.yPos + "%",
              }}
              onClick={() => {
                setGameStatus("started");
                setTargetCounter(0);
                setTargetPos({
                  xPos: Math.floor(Math.random() * 65) + 15,
                  yPos: Math.floor(Math.random() * 65) + 15,
                });
                startTimeRef.current = Date.now();
                totalClicksRef.current = 0;
              }}
            />
          </>
        )}
        {gameStatus === "started" && (
          <>
            <div className="target-game-info">
              <p>Remaining targets: {targetAmount - targetCounter}</p>
            </div>
            <Target
              style={{ left: targetPos.xPos + "%", top: targetPos.yPos + "%" }}
              onClick={() => {
                setTargetPos({
                  xPos: Math.floor(Math.random() * 65) + 15,
                  yPos: Math.floor(Math.random() * 65) + 15,
                });
                setTargetCounter((c) => c + 1);

                if (targetCounter === targetAmount - 1) {
                  totalTimeRef.current = Date.now() - startTimeRef.current;
                  setGameStatus("ended");
                }
              }}
            />
          </>
        )}
        {gameStatus === "ended" && (
          <div className="target-results-main_grid">
            <div className="target-results-background" />
            <div className="target-results-title">Results</div>
            <div className="target-button-wrapper">
              <button
                className="target-results-play_again"
                onClick={() => {
                  setGameStatus("not started");
                }}
              >
                Play Again
              </button>
              {auth.authenticated && (
                <>
                  {loadStatus === "not saved" && (
                    <button
                      className="target-results-save_score"
                      onClick={saveScore}
                    >
                      Save Score
                    </button>
                  )}
                  {loadStatus === "saving" && (
                    <button
                      className="target-results-save_score saving"
                      disabled
                    >
                      Saving...
                    </button>
                  )}
                  {loadStatus === "saved" && (
                    <button className="target-results-save_score" disabled>
                      Saved!
                    </button>
                  )}
                </>
              )}
              {!auth.authenticated && (
                <button
                  className="target-results-save_score no_auth"
                  title="login to save data"
                  disabled
                >
                  Save Score
                </button>
              )}
            </div>
            <div className="target-results-average_time">
              Time per Target: {timePerTarget}ms
            </div>
            <div className="target-results-accuracy">Accuracy: {accuracy}%</div>
            <div className="target-results-target_amount">
              Targets Hit: {targetAmount}
            </div>
            <div className="target-results-click_amount">
              Total Clicks: {clicks}
            </div>
            <div className="target-results-total_time">
              Time Elapsed: {time} seconds
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TargetsPage;
