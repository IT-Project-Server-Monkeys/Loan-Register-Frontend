import React from "react";
import '../styles/LandingPage.scss';
import { useMediaQuery } from 'react-responsive';
import { Header } from "../components";

const Home = (props) => {

  const redirect = () => {
    window.location.href='/signup';
  };

  const isMobile = useMediaQuery({
    query: "(max-device-width: 768px)",
  });

  return (
    <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
      <div className={"landing-page"}>
        <div className={isMobile? "mobile" : ""}>

          <div className={"background"}>
            <div className={"h1"}>
              Welcome!
            </div>
            <div className={"p"}>
              Loan Register (LR) is an app that is designed to 
              improve your loaning experience, making the process 
              of loaning out and borrowing items simpler and easier than ever before.
            </div>
            <div className={"h3"}>
              Ready to loan an item?
            </div>
            <button onClick={redirect} className={"text-btn-default"}>
                Get Started
            </button>
          </div>

        </div>
      </div>
    </>

  );
};

export default Home;

