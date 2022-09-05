import React from "react";
import '../styles/LandingPage.scss';

const Home = () => {

  const redirect = () => {
    window.location.href='/signup';
  };

  return (
    <div className={"landing-page"}>
      <div className={"img-one"}>
      </div>
      <div className={"intro-box"}>
        <div className={"intro-text"}>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        </div>
        <div className={"icon"}>
        </div>
      </div>
      <div className={"flex-box"}>
        <div className={"img-two"}>
        </div>
        <div className={"text-box"}>
        </div>
      </div>
      <div className={"flex-box"}>
        <div className={"text-box"}>
          Ready to loan an item?
          <button onClick={redirect} className={"text-btn-default"}>
            Get Started
          </button>
        </div>
        <div className={"img-three"}>
        </div>
      </div>
    </div>

  );
};

export default Home;

