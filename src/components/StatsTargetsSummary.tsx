import { useRef, useState, useEffect } from "react";
import { getTargetScoresAggregation } from "../endpoints/api";
import Button from "./Button";

const StatsTargetsSummary = () => {
  type Status = "loading" | "success" | "error";
  type ScoreSummary = {
    average_time: number;
    average_accuracy: number;
  };

  const [status, setStatus] = useState<Status>("loading");
  const [selectedTargetAmount, setSelectedTargetAmount] = useState(10);

  const targetsData = useRef<ScoreSummary>({} as ScoreSummary);

  useEffect(() => {
    const collectTargetsSummary = async () => {
      setStatus("loading");
      const response = await getTargetScoresAggregation(selectedTargetAmount);
      console.log(response);

      if (response.ok) {
        targetsData.current = await response.json();
        setStatus("success");
      } else {
        setStatus("error");
      }
    };

    collectTargetsSummary();
  }, [selectedTargetAmount]);

  return (
    <div className="stats-aggregate-data">
      <Button
        onClick={() => setSelectedTargetAmount(10)}
        isActive={selectedTargetAmount === 10}
      >
        Last 10
      </Button>
      <Button
        onClick={() => setSelectedTargetAmount(20)}
        isActive={selectedTargetAmount === 20}
      >
        Last 20
      </Button>
      <Button
        onClick={() => setSelectedTargetAmount(100000)}
        isActive={selectedTargetAmount === 100000}
      >
        All-Time
      </Button>
      {status === "loading" && <div>loading</div>}
      {status === "success" && (
        <>
          <div>
            Average Time per Target:{" "}
            {targetsData.current.average_time.toFixed(1)}ms ----
          </div>
          <div>
            Average Accuracy: {targetsData.current.average_accuracy.toFixed(1)}%
          </div>
        </>
      )}
      {status === "error" && <div>ERROR</div>}
    </div>
  );
};

export default StatsTargetsSummary;
