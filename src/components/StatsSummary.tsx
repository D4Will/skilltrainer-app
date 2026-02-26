import { useState, useEffect } from "react";
import {
  getTargetScoresAggregation,
  getReactionScoresAggregation,
  getTypingScoresAggregation,
} from "../endpoints/api";
import Button from "./Button";
import type { Skill } from "../pages/StatsPage";

interface Props {
  mode: Skill;
}

const StatsSummary = ({ mode }: Props) => {
  type Status = "loading" | "success" | "no data" | "error";

  type TargetScoreSummary = {
    average_time: number;
    average_accuracy: number;
  };

  type ReactionScoreSummary = {
    average_time: number;
  };

  type TypingScoreSummary = {
    average_wpm: number;
    average_accuracy: number;
    average_raw_wpm: number;
  };

  type AggregateSize = 10 | 20 | 100000;

  const [targetStatusAll, setTargetStatusAll] = useState<Status>("loading");
  const [targetStatus20, setTargetStatus20] = useState<Status>("loading");
  const [targetStatus10, setTargetStatus10] = useState<Status>("loading");

  const [targetAggregateSize, setTargetAggregateSize] =
    useState<AggregateSize>(100000);

  const [targetsDataAll, setTargetsDataAll] = useState<TargetScoreSummary>(
    {} as TargetScoreSummary,
  );
  const [targetsData20, setTargetsData20] = useState<TargetScoreSummary>(
    {} as TargetScoreSummary,
  );
  const [targetsData10, setTargetsData10] = useState<TargetScoreSummary>(
    {} as TargetScoreSummary,
  );

  const [reactionStatusAll, setReactionStatusAll] = useState<Status>("loading");
  const [reactionStatus20, setReactionStatus20] = useState<Status>("loading");
  const [reactionStatus10, setReactionStatus10] = useState<Status>("loading");

  const [reactionAggregateSize, setReactionAggregateSize] =
    useState<AggregateSize>(100000);

  const [reactionDataAll, setReactionDataAll] = useState<ReactionScoreSummary>(
    {} as ReactionScoreSummary,
  );
  const [reactionData20, setReactionData20] = useState<ReactionScoreSummary>(
    {} as ReactionScoreSummary,
  );
  const [reactionData10, setReactionData10] = useState<ReactionScoreSummary>(
    {} as ReactionScoreSummary,
  );

  const [typingStatusAll, setTypingStatusAll] = useState<Status>("loading");
  const [typingStatus20, setTypingStatus20] = useState<Status>("loading");
  const [typingStatus10, setTypingStatus10] = useState<Status>("loading");

  const [typingAggregateSize, setTypingAggregateSize] =
    useState<AggregateSize>(100000);

  const [typingDataAll, setTypingDataAll] = useState<TypingScoreSummary>(
    {} as TypingScoreSummary,
  );
  const [typingData20, setTypingData20] = useState<TypingScoreSummary>(
    {} as TypingScoreSummary,
  );
  const [typingData10, setTypingData10] = useState<TypingScoreSummary>(
    {} as TypingScoreSummary,
  );

  useEffect(() => {
    const collectTargetsSummaryAll = async () => {
      const response = await getTargetScoresAggregation(100000);
      console.log(response);

      if (response.ok) {
        setTargetsDataAll(await response.json());
        setTargetStatusAll("success");
      } else if (response.status === 404) {
        setTargetStatusAll("no data");
      } else {
        setTargetStatusAll("error");
      }
    };

    const collectTargetsSummary20 = async () => {
      const response = await getTargetScoresAggregation(20);

      if (response.ok) {
        setTargetsData20(await response.json());
        setTargetStatus20("success");
      } else if (response.status === 404) {
        setTargetStatus20("no data");
      } else {
        setTargetStatus20("error");
      }
    };

    const collectTargetsSummary10 = async () => {
      const response = await getTargetScoresAggregation(10);

      if (response.ok) {
        setTargetsData10(await response.json());
        setTargetStatus10("success");
      } else if (response.status === 404) {
        setTargetStatus10("no data");
      } else {
        setTargetStatus10("error");
      }
    };

    const collectReactionSummaryAll = async () => {
      const response = await getReactionScoresAggregation(100000);
      console.log(response);

      if (response.ok) {
        setReactionDataAll(await response.json());
        setReactionStatusAll("success");
      } else if (response.status === 404) {
        setReactionStatusAll("no data");
      } else {
        setReactionStatusAll("error");
      }
    };

    const collectReactionSummary20 = async () => {
      const response = await getReactionScoresAggregation(20);
      console.log(response);

      if (response.ok) {
        setReactionData20(await response.json());
        setReactionStatus20("success");
      } else if (response.status === 404) {
        setReactionStatus20("no data");
      } else {
        setReactionStatus20("error");
      }
    };

    const collectReactionSummary10 = async () => {
      const response = await getReactionScoresAggregation(10);
      console.log(response);

      if (response.ok) {
        setReactionData10(await response.json());
        setReactionStatus10("success");
      } else if (response.status === 404) {
        setReactionStatus10("no data");
      } else {
        setReactionStatus10("error");
      }
    };

    const collectTypingSummaryAll = async () => {
      const response = await getTypingScoresAggregation(100000);
      console.log(response);

      if (response.ok) {
        setTypingDataAll(await response.json());
        setTypingStatusAll("success");
      } else if (response.status === 404) {
        setTypingStatusAll("no data");
      } else {
        setTypingStatusAll("error");
      }
    };

    const collectTypingSummary20 = async () => {
      const response = await getTypingScoresAggregation(20);
      console.log(response);

      if (response.ok) {
        setTypingData20(await response.json());
        setTypingStatus20("success");
      } else if (response.status === 404) {
        setTypingStatus20("no data");
      } else {
        setTypingStatus20("error");
      }
    };

    const collectTypingSummary10 = async () => {
      const response = await getTypingScoresAggregation(10);
      console.log(response);

      if (response.ok) {
        setTypingData10(await response.json());
        setTypingStatus10("success");
      } else if (response.status === 404) {
        setTypingStatus10("no data");
      } else {
        setTypingStatus10("error");
      }
    };

    if (mode === "targets") {
      if (targetAggregateSize === 100000) {
        if (targetStatusAll === "loading") {
          collectTargetsSummaryAll();
        }
      } else if (targetAggregateSize === 20) {
        if (targetStatus20 === "loading") {
          collectTargetsSummary20();
        }
      } else if (targetAggregateSize === 10) {
        if (targetStatus10 === "loading") {
          collectTargetsSummary10();
        }
      }
    } else if (mode === "reaction") {
      if (reactionAggregateSize === 100000) {
        if (reactionStatusAll === "loading") {
          collectReactionSummaryAll();
        }
      } else if (reactionAggregateSize === 20) {
        if (reactionStatus20 === "loading") {
          collectReactionSummary20();
        }
      } else if (reactionAggregateSize === 10) {
        if (reactionStatus10 === "loading") {
          collectReactionSummary10();
        }
      }
    } else if (mode === "typing") {
      if (typingAggregateSize === 100000) {
        collectTypingSummaryAll();
      } else if (typingAggregateSize === 20) {
        collectTypingSummary20();
      } else if (typingAggregateSize === 10) {
        collectTypingSummary10();
      }
    }
  }, [targetAggregateSize, reactionAggregateSize, typingAggregateSize, mode]);

  const setAggregatePerMode = (size: AggregateSize): void => {
    if (mode === "targets") {
      setTargetAggregateSize(size);
    } else if (mode === "reaction") {
      setReactionAggregateSize(size);
    } else if (mode === "typing") {
      setTypingAggregateSize(size);
    }
  };

  const checkAggregationPerMode = (size: AggregateSize): boolean => {
    if (mode === "targets") {
      if (size === targetAggregateSize) {
        return true;
      }
      return false;
    } else if (mode === "reaction") {
      if (size === reactionAggregateSize) {
        return true;
      }
      return false;
    } else {
      if (size === typingAggregateSize) {
        return true;
      }
      return false;
    }
  };

  return (
    <div className="stats-aggregate-layout">
      <div className="stats-aggregate-button-group">
        <Button
          className="stats-aggregate-button"
          activeClassName="stats-aggregate-button active"
          onClick={() => setAggregatePerMode(100000)}
          isActive={checkAggregationPerMode(100000)}
        >
          All-Time
        </Button>
        <Button
          className="stats-aggregate-button"
          activeClassName="stats-aggregate-button active"
          onClick={() => setAggregatePerMode(20)}
          isActive={checkAggregationPerMode(20)}
        >
          Last 20
        </Button>
        <Button
          className="stats-aggregate-button"
          activeClassName="stats-aggregate-button active"
          onClick={() => setAggregatePerMode(10)}
          isActive={checkAggregationPerMode(10)}
        >
          Last 10
        </Button>
      </div>
      <div className="stats-aggregate-data">
        {mode === "targets" && (
          <>
            {targetAggregateSize === 100000 && (
              <>
                {targetStatusAll === "loading" && (
                  <div className="stats-aggregate-status">loading...</div>
                )}
                {targetStatusAll === "success" && (
                  <>
                    <div className="stats-aggregate-data-item">
                      Average Time per Target: {targetsDataAll.average_time}ms
                    </div>
                    <div className="stats-aggregate-data-item">
                      Average Accuracy: {targetsDataAll.average_accuracy}%
                    </div>
                  </>
                )}
                {targetStatusAll === "no data" && (
                  <div className="stats-aggregate-status">No data</div>
                )}
                {targetStatusAll === "error" && (
                  <div className="stats-aggregate-status">ERROR</div>
                )}
              </>
            )}
            {targetAggregateSize === 20 && (
              <>
                {targetStatus20 === "loading" && (
                  <div className="stats-aggregate-status">loading...</div>
                )}
                {targetStatus20 === "success" && (
                  <>
                    <div className="stats-aggregate-data-item">
                      Average Time per Target: {targetsData20.average_time}ms
                    </div>
                    <div className="stats-aggregate-data-item">
                      Average Accuracy: {targetsData20.average_accuracy}%
                    </div>
                  </>
                )}
                {targetStatus20 === "no data" && (
                  <div className="stats-aggregate-status">No data</div>
                )}
                {targetStatus20 === "error" && (
                  <div className="stats-aggregate-status">ERROR</div>
                )}
              </>
            )}
            {targetAggregateSize === 10 && (
              <>
                {targetStatus10 === "loading" && (
                  <div className="stats-aggregate-status">loading...</div>
                )}
                {targetStatus10 === "success" && (
                  <>
                    <div className="stats-aggregate-data-item">
                      Average Time per Target: {targetsData10.average_time}ms
                    </div>
                    <div className="stats-aggregate-data-item">
                      Average Accuracy: {targetsData10.average_accuracy}%
                    </div>
                  </>
                )}
                {targetStatus10 === "no data" && (
                  <div className="stats-aggregate-status">No data</div>
                )}
                {targetStatus10 === "error" && (
                  <div className="stats-aggregate-status">ERROR</div>
                )}
              </>
            )}
          </>
        )}
        {mode === "reaction" && (
          <>
            {reactionAggregateSize === 100000 && (
              <>
                {reactionStatusAll === "loading" && (
                  <div className="stats-aggregate-status">loading...</div>
                )}
                {reactionStatusAll === "success" && (
                  <div className="stats-aggregate-data-item">
                    Average Reaction Time: {reactionDataAll.average_time}ms
                  </div>
                )}
                {reactionStatusAll === "no data" && (
                  <div className="stats-aggregate-status">No data</div>
                )}
                {reactionStatusAll === "error" && (
                  <div className="stats-aggregate-status">ERROR</div>
                )}
              </>
            )}
            {reactionAggregateSize === 20 && (
              <>
                {reactionStatus20 === "loading" && (
                  <div className="stats-aggregate-status">loading...</div>
                )}
                {reactionStatus20 === "success" && (
                  <div className="stats-aggregate-data-item">
                    Average Reaction Time: {reactionData20.average_time}ms
                  </div>
                )}
                {reactionStatus20 === "no data" && (
                  <div className="stats-aggregate-status">No data</div>
                )}
                {reactionStatus20 === "error" && (
                  <div className="stats-aggregate-status">ERROR</div>
                )}
              </>
            )}
            {reactionAggregateSize === 10 && (
              <>
                {reactionStatus10 === "loading" && (
                  <div className="stats-aggregate-status">loading...</div>
                )}
                {reactionStatus10 === "success" && (
                  <div className="stats-aggregate-data-item">
                    Average Reaction Time: {reactionData10.average_time}ms
                  </div>
                )}
                {reactionStatus10 === "no data" && (
                  <div className="stats-aggregate-status">No data</div>
                )}
                {reactionStatus10 === "error" && (
                  <div className="stats-aggregate-status">ERROR</div>
                )}
              </>
            )}
          </>
        )}
        {mode === "typing" && (
          <>
            {typingAggregateSize === 100000 && (
              <>
                {typingStatusAll === "loading" && (
                  <div className="stats-aggregate-status">loading...</div>
                )}
                {typingStatusAll === "success" && (
                  <>
                    <div className="stats-aggregate-data-item">
                      Average WPM: {typingDataAll.average_wpm}
                    </div>
                    <div className="stats-aggregate-data-item">
                      Average Accuracy: {typingDataAll.average_accuracy}%
                    </div>
                    <div className="stats-aggregate-data-item">
                      Average Raw WPM: {typingDataAll.average_raw_wpm}
                    </div>
                  </>
                )}
                {typingStatusAll === "no data" && (
                  <div className="stats-aggregate-status">No data</div>
                )}
                {typingStatusAll === "error" && (
                  <div className="stats-aggregate-status">ERROR</div>
                )}
              </>
            )}
            {typingAggregateSize === 20 && (
              <>
                {typingStatus20 === "loading" && (
                  <div className="stats-aggregate-status">loading...</div>
                )}
                {typingStatus20 === "success" && (
                  <>
                    <div className="stats-aggregate-data-item">
                      Average WPM: {typingData20.average_wpm}
                    </div>
                    <div className="stats-aggregate-data-item">
                      Average Accuracy: {typingData20.average_accuracy}%
                    </div>
                    <div className="stats-aggregate-data-item">
                      Average Raw WPM: {typingData20.average_raw_wpm}
                    </div>
                  </>
                )}
                {typingStatus20 === "no data" && (
                  <div className="stats-aggregate-status">No data</div>
                )}
                {typingStatus20 === "error" && (
                  <div className="stats-aggregate-status">ERROR</div>
                )}
              </>
            )}
            {typingAggregateSize === 10 && (
              <>
                {typingStatus10 === "loading" && (
                  <div className="stats-aggregate-status">loading...</div>
                )}
                {typingStatus10 === "success" && (
                  <>
                    <div className="stats-aggregate-data-item">
                      Average WPM: {typingData10.average_wpm}
                    </div>
                    <div className="stats-aggregate-data-item">
                      Average Accuracy: {typingData10.average_accuracy}%
                    </div>
                    <div className="stats-aggregate-data-item">
                      Average Raw WPM: {typingData10.average_raw_wpm}
                    </div>
                  </>
                )}
                {typingStatus10 === "no data" && (
                  <div className="stats-aggregate-status">No data</div>
                )}
                {typingStatus10 === "error" && (
                  <div className="stats-aggregate-status">ERROR</div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StatsSummary;
