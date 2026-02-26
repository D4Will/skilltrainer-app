import { useAuth } from "../contexts/useAuth";
import StatsScoreItems from "../components/StatsScoreItems";
import StatsSummary from "../components/StatsSummary";
import { useState } from "react";
import Button from "../components/Button";

export type Skill = "targets" | "reaction" | "typing";

const StatsPage = () => {
  const authData = useAuth();
  const username = authData.username;

  const [skill, setSkill] = useState<Skill>("targets");

  return (
    <div className="stats-page-layout">
      <div className="stats-skill-selector">
        <Button
          className="stats-skill-item"
          activeClassName="stats-skill-item active"
          onClick={() => {
            setSkill("targets");
          }}
          isActive={skill === "targets"}
        >
          Targets
        </Button>
        <Button
          className="stats-skill-item"
          activeClassName="stats-skill-item active"
          onClick={() => {
            setSkill("reaction");
          }}
          isActive={skill === "reaction"}
        >
          Reaction
        </Button>
        <Button
          className="stats-skill-item"
          activeClassName="stats-skill-item active"
          onClick={() => {
            setSkill("typing");
          }}
          isActive={skill === "typing"}
        >
          Typing
        </Button>
      </div>

      <div className="stats-username-area">{username}</div>

      <div className="stats-aggregate-area">
        <StatsSummary mode={skill} />
      </div>

      <div className="stats-previous-tests-area">
        <div className="stats-previous-tests-title">Last 10 Scores</div>
        <StatsScoreItems mode={skill} />
      </div>
    </div>
  );
};

export default StatsPage;
