import type { ReactNode } from "react";
import { useRef, useState, useEffect } from "react";
import {
  getLastTargetScores,
  getLastReactionScores,
  getLastTypingScores,
} from "../endpoints/api";
import type { Skill } from "../pages/StatsPage";

interface Props {
  mode: Skill;
}

const StatsScoreItems = ({ mode }: Props) => {
  type Status = "loading" | "success" | "error";

  type TargetScore = {
    id: number;
    time_elapsed: string;
    clicks: number;
    targets: number;
    user: number;
  };

  type ReactionScore = {
    id: number;
    reaction_times: number[];
  };

  type TypingScore = {
    id: number;
    wpm: number;
    accuracy: number;
    raw_wpm: number;
    time_mode: number;
  };

  const [targetStatus, setTargetStatus] = useState<Status>("loading");
  const [reactionStatus, setReactionStatus] = useState<Status>("loading");
  const [typingStatus, setTypingStatus] = useState<Status>("loading");

  const targetsScores = useRef<TargetScore[]>([]);
  const [formattedTargetScores, setFormattedTargetScores] = useState<
    ReactNode[]
  >([]);

  const reactionScores = useRef<ReactionScore[]>([]);
  const [formattedReactionScores, setFormattedReactionScores] = useState<
    ReactNode[]
  >([]);

  const typingScores = useRef<TypingScore[]>([]);
  const [formattedTypingScores, setFormattedTypingScores] = useState<
    ReactNode[]
  >([]);

  useEffect(() => {
    const collectTargetScores = async () => {
      const response = await getLastTargetScores();
      console.log(response);

      if (response.ok) {
        targetsScores.current = await response.json();
        setFormattedTargetScores(formatTargetScores(targetsScores.current));
        setTargetStatus("success");
      } else {
        setTargetStatus("error");
      }
    };

    collectTargetScores();
  }, []);

  useEffect(() => {
    const collectReactionScores = async () => {
      const response = await getLastReactionScores();
      console.log(response);

      if (response.ok) {
        reactionScores.current = await response.json();
        setFormattedReactionScores(
          formatReactionScores(reactionScores.current),
        );
        setReactionStatus("success");
      } else {
        setReactionStatus("error");
      }
    };

    const collectTypingScores = async () => {
      const response = await getLastTypingScores();
      console.log(response);

      if (response.ok) {
        typingScores.current = await response.json();
        setFormattedTypingScores(formatTypingScores(typingScores.current));
        setTypingStatus("success");
      } else {
        setTypingStatus("error");
      }
    };

    if (mode === "reaction") {
      if (reactionStatus === "loading") {
        collectReactionScores();
      }
    } else if (mode === "typing") {
      if (typingStatus === "loading") {
        collectTypingScores();
      }
    }
  }, [mode]);

  const formatTargetScores = (targetScores: TargetScore[]): ReactNode[] => {
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

      if (timeTotal / targetAmount > 9999) {
        return "9999+";
      }

      return String(Math.round(timeTotal / targetAmount));
    };

    const formattedScores = targetScores.map((score) => (
      <div className="stats-score-item" key={score.id}>
        <div className="stats-score-item-item">
          Time / Target:{" "}
          {calculateTimePerTarget(score.time_elapsed, score.targets)}ms
        </div>
        <div className="stats-score-item-item">
          Accuracy: {((score.targets / score.clicks) * 100).toFixed(1)}%
        </div>
        <div className="stats-score-item-item">Targets: {score.targets}</div>
      </div>
    ));
    return formattedScores;
  };

  const formatReactionScores = (
    reactionScores: ReactionScore[],
  ): ReactNode[] => {
    const formattedScores = reactionScores.map((score) => {
      let formattedString: string = "";
      let averageTime: number = 0;
      for (let i = 0; i < score.reaction_times.length - 1; i++) {
        if (score.reaction_times[i] > 9999) {
          averageTime += 9999;
          formattedString += "9999+, ";
        } else {
          averageTime += score.reaction_times[i];
          formattedString += String(score.reaction_times[i]) + ", ";
        }
      }
      if (score.reaction_times[score.reaction_times.length - 1] > 9999) {
        averageTime += 9999;
        formattedString += "9999+";
      } else {
        averageTime += score.reaction_times[score.reaction_times.length - 1];
        formattedString += String(
          score.reaction_times[score.reaction_times.length - 1],
        );
      }
      averageTime = Math.round(averageTime / score.reaction_times.length);

      return (
        <div className="stats-score-item-reaction" key={score.id}>
          <div className="stats-score-item-item-reaction">
            Times: {formattedString}
          </div>
          <div className="stats-score-item-item">Average: {averageTime}ms</div>
          <div className="stats-score-item-item">
            Rounds Played: {score.reaction_times.length}
          </div>
        </div>
      );
    });
    return formattedScores;
  };

  const formatTypingScores = (typingScores: TypingScore[]): ReactNode[] => {
    const formattedScores = typingScores.map((score) => (
      <div className="stats-score-item-typing" key={score.id}>
        <div className="stats-score-item-item">WPM: {score.wpm}</div>
        <div className="stats-score-item-item">Accuracy: {score.accuracy}</div>
        <div className="stats-score-item-item">Raw WPM: {score.raw_wpm}</div>
        <div className="stats-score-item-item">
          Time Mode: {score.time_mode}
        </div>
      </div>
    ));
    return formattedScores;
  };

  return (
    <>
      {mode === "targets" && (
        <>
          {targetStatus === "loading" && <div>"loading..."</div>}
          {targetStatus === "success" && (
            <div className="stats-score-wrapper">{formattedTargetScores}</div>
          )}
          {targetStatus === "error" && <div>"error"</div>}
        </>
      )}
      {mode === "reaction" && (
        <>
          {reactionStatus === "loading" && <div>"loading..."</div>}
          {reactionStatus === "success" && (
            <div className="stats-score-wrapper">{formattedReactionScores}</div>
          )}
          {reactionStatus === "error" && <div>"error"</div>}
        </>
      )}
      {mode === "typing" && (
        <>
          {typingStatus === "loading" && <div>"loading..."</div>}
          {typingStatus === "success" && (
            <div className="stats-score-wrapper">{formattedTypingScores}</div>
          )}
          {typingStatus === "error" && <div>"error"</div>}
        </>
      )}
    </>
  );
};

export default StatsScoreItems;
