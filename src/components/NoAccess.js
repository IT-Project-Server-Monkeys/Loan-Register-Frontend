import React from "react";
import "../styles/Overlay.scss";

const NoAccess = (props) => {

  return (
    <div className="overlay" style={props.style}>
      <div className={"no-access"}>
        <h4>You do not have permission to access this page!</h4>
        <p>Redirecting...</p>
      </div>
    </div>
  );
};

export default NoAccess;