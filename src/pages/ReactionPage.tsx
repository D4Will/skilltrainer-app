import { useState, useRef, useEffect } from "react";
import Button from "../components/Button";
import { submitReactionScore } from "../endpoints/api";
import { useAuth } from "../contexts/useAuth";

const ReactionPage = () => {
  const auth = useAuth();

  type gameStatus =
    | "not started"
    | "waiting"
    | "ready"
    | "clicked"
    | "rushed"
    | "ended";

  type colorClass =
    | "reaction-default"
    | "reaction-orange"
    | "reaction-green"
    | "reaction-red";

  type loadStatus = "not saved" | "saving" | "saved";

  const [gameStatus, setGameStatus] = useState<gameStatus>("not started");
  const [rounds, setRounds] = useState<number>(3);
  const [colorClass, setColorClass] = useState<colorClass>("reaction-default");
  const [reactionTimesList, setReactionTimesList] = useState<number[]>([]);
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [avgReaction, setAvgReaction] = useState<number>(0);
  const [loadStatus, setLoadStatus] = useState<loadStatus>("not saved");

  const randomTime = useRef<number>(0);
  const startTime = useRef<number>(0);
  const reactionTimeRef = useRef<number>(0);
  const reactionTimesListRef = useRef<number[]>([]);
  const timeoutRef = useRef<number>(0);
  const remainingRounds = useRef<number>(0);

  useEffect(() => {
    const afterTimeout = (): void => {
      setGameStatus("ready");
      setColorClass("reaction-green");
      startTime.current = Date.now();
    };

    if (gameStatus === "waiting") {
      randomTime.current = Math.floor(Math.random() * 5251) + 1750;
      timeoutRef.current = setTimeout(afterTimeout, randomTime.current);
    }

    if (gameStatus === "rushed") {
      clearTimeout(timeoutRef.current);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus === "not started") {
      remainingRounds.current = rounds;
      reactionTimesListRef.current = [];
    }
    if (gameStatus === "ended") {
      setLoadStatus("not saved");

      let avg: number = 0;
      reactionTimesListRef.current.forEach((time) => {
        avg += time;
      });
      avg = Math.round(avg / rounds);

      setAvgReaction(avg);

      setReactionTimesList(reactionTimesListRef.current);
      remainingRounds.current = rounds;
    }
  }, [gameStatus]);

  useEffect(() => {
    remainingRounds.current = rounds;
  }, [rounds]);

  async function saveScore(): Promise<void> {
    setLoadStatus("saving");
    await submitReactionScore(reactionTimesListRef.current);
    setLoadStatus("saved");
  }

  const handleClick = (): void => {
    switch (gameStatus) {
      case "not started":
        setGameStatus("waiting");
        setColorClass("reaction-orange");
        break;
      case "waiting":
        setGameStatus("rushed");
        setColorClass("reaction-red");
        break;
      case "ready":
        reactionTimeRef.current = Date.now() - startTime.current;
        setGameStatus("clicked");
        setColorClass("reaction-default");
        remainingRounds.current -= 1;
        reactionTimesListRef.current.push(reactionTimeRef.current);
        setReactionTime(reactionTimeRef.current);
        break;
      case "clicked":
        setGameStatus("waiting");
        setColorClass("reaction-orange");
        break;
      case "rushed":
        setGameStatus("waiting");
        setColorClass("reaction-orange");
        break;
    }

    if (remainingRounds.current === 0) {
      setGameStatus("ended");
      setColorClass("reaction-default");
    }
  };

  return (
    <>
      {gameStatus === "not started" && (
        <div className="reaction-round-button-group">
          <Button
            className="reaction-round-selector"
            activeClassName="reaction-round-selector-active"
            onClick={() => setRounds(3)}
            isActive={rounds === 3}
          >
            3 Rounds
          </Button>
          <Button
            className="reaction-round-selector"
            activeClassName="reaction-round-selector-active"
            onClick={() => setRounds(5)}
            isActive={rounds === 5}
          >
            5 Rounds
          </Button>
          <Button
            className="reaction-round-selector"
            activeClassName="reaction-round-selector-active"
            onClick={() => setRounds(7)}
            isActive={rounds === 7}
          >
            7 Rounds
          </Button>
        </div>
      )}
      <div
        className={"reaction-game-window " + colorClass}
        onMouseDownCapture={handleClick}
      >
        {gameStatus === "not started" && (
          <div className="reaction-game-text">
            <div className="reaction-game-text-item">
              Press anywhere to begin
            </div>
          </div>
        )}
        {gameStatus === "waiting" && (
          <div className="reaction-game-text">
            <div className="reaction-game-text-item">Wait...</div>
          </div>
        )}
        {gameStatus === "rushed" && (
          <div className="reaction-game-text">
            <div className="reaction-game-text-item">Too soon!</div>
            <div className="reaction-game-text-item">Click to continue</div>
          </div>
        )}
        {gameStatus === "ready" && (
          <div className="reaction-game-text">
            <div className="reaction-game-text-item">Click!</div>
          </div>
        )}
        {gameStatus === "clicked" && (
          <div className="reaction-game-text">
            <div className="reaction-game-text-item">
              Reacted in {reactionTime}ms
            </div>
            <div className="reaction-game-text-item">Click to continue</div>
          </div>
        )}
        {gameStatus === "ended" && (
          <div className="reaction-results-main_grid">
            <div className="reaction-results-background" />
            <div className="reaction-results-title">Results</div>

            <div className="reaction-button-wrapper">
              <button
                className="reaction-results-play_again"
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
                      className="reaction-results-save_score"
                      onClick={saveScore}
                    >
                      Save Score
                    </button>
                  )}
                  {loadStatus === "saving" && (
                    <button
                      className="reaction-results-save_score saving"
                      disabled
                    >
                      Saving...
                    </button>
                  )}
                  {loadStatus === "saved" && (
                    <button className="reaction-results-save_score" disabled>
                      Saved!
                    </button>
                  )}
                </>
              )}
              {!auth.authenticated && (
                <button
                  className="reaction-results-save_score"
                  title="login to save data"
                  disabled
                >
                  Save Score
                </button>
              )}
            </div>

            <div className="reaction-results-list-label">Reaction Times:</div>
            <div className="reaction-results-list-items">
              {reactionTimesList.toString()}
            </div>
            <div className="reaction-results-average">
              Average: {avgReaction}ms
            </div>
            <div className="reaction-results-rounds_played">
              Rounds Played: {rounds}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReactionPage;
