import { useState, useRef, useEffect } from "react";

const ReactionPage = () => {
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

  const [gameStatus, setGameStatus] = useState<gameStatus>("not started");
  const [roundsPlayed, setRoundsPlayed] = useState<number>(0);
  const [colorClass, setColorClass] = useState<colorClass>("reaction-default");
  const [reactionTimesList, setReactionTimesList] = useState<number[]>([]);
  const [reactionTime, setReactionTime] = useState<number>(0);

  const randomTime = useRef<number>(0);
  const startTime = useRef<number>(0);
  const reactionTimeRef = useRef<number>(0);
  const reactionTimesListRef = useRef<number[]>([]);

  useEffect(() => {
    const afterTimeout = (): void => {
      setGameStatus("ready");
      setColorClass("reaction-green");
      startTime.current = Date.now();
    };

    if (gameStatus === "waiting") {
      randomTime.current = Math.floor(Math.random() * 4501) + 1500;
      setTimeout(afterTimeout, randomTime.current);
    }
  }, [gameStatus]);

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
        setRoundsPlayed((r) => r + 1);
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
      case "ended":
        setGameStatus("waiting");
        setColorClass("reaction-orange");
        break;
    }

    if (roundsPlayed === 3) {
      setGameStatus("ended");
      setColorClass("reaction-default");
      setReactionTimesList(reactionTimesListRef.current);
      reactionTimesListRef.current = [];
      setRoundsPlayed(0);
    }
  };

  return (
    <div
      className={"reaction-game-window " + colorClass}
      onMouseDownCapture={handleClick}
    >
      <div>{gameStatus}</div>
      {gameStatus === "clicked" && <div>{reactionTime}</div>}
      {gameStatus === "ended" && <div>{reactionTimesList.toString()}</div>}
    </div>
  );
};

export default ReactionPage;
