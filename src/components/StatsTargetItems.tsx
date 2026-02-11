import type { ReactNode } from "react";
import { useRef, useState, useEffect } from "react";
import { getLastTargetScores } from "../endpoints/api";

const StatsTargetItems = () => {
  type Status = "loading" | "success" | "error";
  type Score = {
    id: number;
    time_elapsed: string;
    clicks: number;
    targets: number;
    user: number;
  };

  const [status, setStatus] = useState<Status>("loading");

  const targetsScores = useRef<Score[]>([]);
  const formattedScores = useRef<ReactNode[]>([]);

  useEffect(() => {
    const collectTargetScores = async () => {
      const response = await getLastTargetScores();
      console.log(response);

      if (response.ok) {
        targetsScores.current = await response.json();
        formattedScores.current = formatScores(targetsScores.current);
        setStatus("success");
      } else {
        setStatus("error");
      }
    };

    collectTargetScores();
  }, []);

  const calculateTimePerTarget = (
    timeString: string,
    targetAmount: number,
  ): string => {
    if (timeString.length !== 15) {
      return "ERROR";
    }

    let timeTotal: number = 0;
    timeTotal += Number(timeString.slice(12, 15)) / 1000;
    timeTotal += Number(timeString.slice(9, 12));
    timeTotal += Number(timeString.slice(6, 8)) * 1000;
    timeTotal += Number(timeString.slice(3, 5)) * 60 * 1000;
    timeTotal += Number(timeString.slice(0, 2)) * 60 * 60 * 1000;

    if (timeTotal / targetAmount > 9999.9) {
      return "9999.9+";
    }

    return String((timeTotal / targetAmount).toFixed(1));
  };

  const formatScores = (targetScores: Score[]): ReactNode[] => {
    const formattedScores = targetScores.map((score) => (
      <div className="stats-score-item" key={score.id}>
        <div>
          Time per target:{" "}
          {calculateTimePerTarget(score.time_elapsed, score.targets)}ms ---
        </div>
        <div>
          Accuracy: {((score.targets / score.clicks) * 100).toFixed(1)}%
          ---{" "}
        </div>
        <div>Targets: {score.targets}</div>
      </div>
    ));
    return formattedScores;
  };

  return (
    <>
      {status === "loading" && "loading..."}
      {status === "success" && <div>{formattedScores.current}</div>}
      {status === "error" && "error"}
    </>
  );
};

export default StatsTargetItems;
