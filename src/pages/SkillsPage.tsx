import { Link } from "react-router";

const SkillsPage = () => {
  return (
    <>
      <h1 className="skill-skills-title">Skills</h1>
      <div className="skill-wrapper">
        <Link to="/targets" className="skill-item-wrapper">
          <img
            className="skill-item-img"
            src="/targetsIcon.png"
            alt="target trainer icon"
          />
          <div className="skill-item-text">Aim Trainer</div>
        </Link>
        <Link to="/reaction" className="skill-item-wrapper">
          <img
            className="skill-item-img"
            src="/reactionIcon.png"
            alt="reaction trainer icon"
          />
          <div className="skill-item-text">Reaction Trainer</div>
        </Link>
        <Link to="/typing" className="skill-item-wrapper">
          <img
            className="skill-item-img"
            src="/typingIcon.png"
            alt="typing trainer icon"
          />
          <div className="skill-item-text">Typing Trainer</div>
        </Link>
      </div>
    </>
  );
};

export default SkillsPage;
