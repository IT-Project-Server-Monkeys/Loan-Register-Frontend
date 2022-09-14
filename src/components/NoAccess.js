import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import "../styles/Overlay.scss";

const NoAccess = (props) => {
  const [ellipsis, setEllipsis] = useState("");


  useEffect(() => {
    setInterval(() => {
      setEllipsis((prev) => {
        if (prev.length >= 3) return "";
        else return prev.concat(".");
      })
    }, 1000);
  }, [])

  return (
    <div className="overlay" style={props.style}>
      <div className={"no-access"}>
        <h4>You do not have permission to access to this page!</h4>
        <p>Redirecting...</p>
      </div>
    </div>
  );
};

export default NoAccess;