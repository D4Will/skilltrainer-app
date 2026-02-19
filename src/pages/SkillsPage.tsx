import { Link } from "react-router";

const SkillsPage = () => {
  return (
    <div>
      <Link to="/targets">Aim Trainer</Link>
      <br></br>
      <Link to="/reaction">Reaction Trainer</Link>
      <br></br>
      <Link to="/typing">Typing Trainer</Link>
    </div>
  );
};

export default SkillsPage;
