import { useAuth } from "../contexts/useAuth";

const StatsPage = () => {
  const authData = useAuth();
  const username = authData.username;

  return <div>StatsPage {username}</div>;
};

export default StatsPage;
