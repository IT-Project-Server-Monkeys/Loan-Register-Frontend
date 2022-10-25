import React from "react";
import '../styles/NotFound.scss';
import { Header, TextButton } from "../components";
import { Link } from "react-router-dom";

const NotFound = (props) => {

  return (
    <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
      <div className={"not-found"}>
        <div className="content">
          <h1>404</h1>
          <p>Page not found.</p>
          {props.loggedIn
          ? <Link to="/dashboard"><TextButton>Go to dashboard</TextButton></Link>
          : <Link to="/"><TextButton>Go to homepage</TextButton></Link>
          }
        </div>
      </div>
    </>

  );
};

export default NotFound;

