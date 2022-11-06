import React from "react";
import "../styles/Overlay.scss";

// display to notify the user that they do not have access to a page
const NoAccess = (props) => {

  return (
    <div className="overlay" style={props.style}>
      <div className={"no-access"}>
        <h4>{props.sessionExpired === true
        ? "Your session has expired due to inactivity. Please log in again."
        : "You do not have permission to view this page!"}</h4>
        <p>Redirecting...</p>
      </div>
    </div>
  );
};

export default NoAccess;