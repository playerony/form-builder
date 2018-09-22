import React from "react";
import { Link } from "react-router-dom";
 
import "./Landing.scss";

const Landing = () => {
  return (
    <div className="landing-wrapper">
      <div className="landing-mask">
        <div className="landing-content">
          <h1>FormBuilder</h1>
          <p>Simplest way to build your dream form</p>
          <Link to="/builder" className="landing-content--see-more-button">Create your form</Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
