const Devlog = () => {
  return (
    <article className="devlog">
      <h1>Dev Log</h1>
      <p>
        Date: <time>February 26, 2026</time>
        <br />
        <br />
        <b>Hello!</b> <br />
        My name is William Douglass, the sole developer of Skill Trainer. This
        is my first "big" project and the first time I've deployed a project to
        the web. It is also my first real project with React/Typescript and
        Django DRF. I am aware of many bugs and deficiencies present in the
        currect state of this project, so please be patient and rest assured
        that I am working them out. Also please contact me at{" "}
        <strong>contact@skilltrainer.gg</strong> if you have any issues with the
        site or your account, or have any suggestions on what could be improved.
      </p>
      <h2>Future for this site</h2>
      <p>
        It is my goal to continously host this site, provide support, encrich
        current features and games / "skill trainers", and create much more
        advanced and interactive games / "skill trainers" as I continue to
        develop my skills. I hope you enjoy and see the potential of this
        project as do I.
      </p>
      <br></br>
      <p>Thank you for using this site.</p>
      <br />
      <h3>Improvements Coming:</h3>
      <ul>
        <li>Stylistic changes to improve look of site</li>
        <li>
          Viewport size and device support. Currently, the site is formatted
          only for standard monitor fullscreen display sizes
        </li>
        <li>More Skills</li>
        <li>Full pagination of previous scores for each skill</li>
        <li>Performance optimization</li>
        <li>
          Account deletion page. Currently, send a request to{" "}
          <strong>contact@skilltrainer.gg</strong>
        </li>
      </ul>
      <h3>Farther out:</h3>
      <ul>
        <li>More indepth statistical analysis</li>
        <li>
          Social features such as leaderboards, friending other users, and
          viewing sharing scores with other users
        </li>
      </ul>
    </article>
  );
};

export default Devlog;
