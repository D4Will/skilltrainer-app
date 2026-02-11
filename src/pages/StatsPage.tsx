import { useAuth } from "../contexts/useAuth";
import StatsTargetItems from "../components/StatsTargetItems";
import StatsTargetsSummary from "../components/StatsTargetsSummary";

const StatsPage = () => {
  const authData = useAuth();
  const username = authData.username;

  return (
    <div className="stats-page-layout">
      <ul className="stats-skill-selector">
        <li className="stats-skill-item">Targets</li>
        <li className="stats-skill-item">Reaction</li>
      </ul>

      <div className="stats-username-area">{username}</div>

      <div className="stats-aggregate-area">
        <StatsTargetsSummary />
      </div>

      <div className="stats-previous-tests-area">
        <div>Last 10 Scores</div>
        <StatsTargetItems />
      </div>
    </div>
  );
};

export default StatsPage;
