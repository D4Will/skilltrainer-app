import { useRef, useState, useEffect } from "react";

type status = "not started" | "in progress" | "ended";

interface Props {
  className: string;
  gameStatus: status;
  updateGameStatus: (status: status) => void;
  selectedTime: number;
}

const Timer = ({
  className,
  gameStatus,
  updateGameStatus,
  selectedTime,
}: Props) => {
  const [countdown, setCountdown] = useState<number>(15);
  const intervalId = useRef<number>(0);

  useEffect(() => {
    setCountdown(selectedTime);
  }, [selectedTime]);

  useEffect(() => {
    if (gameStatus === "in progress") {
      console.log("interval started");
      console.log(gameStatus);
      intervalId.current = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    if (gameStatus === "ended") {
      console.log("interval stopped");
      clearInterval(intervalId.current);
    }

    return () => {
      console.log("interval stopped");
      clearInterval(intervalId.current);
    };
  }, [gameStatus]);

  useEffect(() => {
    console.log(countdown);
    if (countdown === 0) {
      updateGameStatus("ended");
    }
  }, [countdown]);

  return <div className={className}>{countdown}</div>;
};

export default Timer;
