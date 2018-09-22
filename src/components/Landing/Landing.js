import React from "react";
import "./Landing.scss";

const Landing = () => {
  return (
    <div className="landing-wrapper">
      <div className="landing-mask">
        <div className="landing-content">
          <h1>FormBuilder</h1>
          <p>Simplest way to build your dream form</p>
          <a className="landing-content--see-more-button">Create your form</a>
        </div>
      </div>
    </div>
  );
};

export default Landing;
