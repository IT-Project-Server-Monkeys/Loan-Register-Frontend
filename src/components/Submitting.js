import React, { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import "../styles/Overlay.scss";

// an overlay to block the page while some form data is submitting
const Submitting = (props) => {
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
      <div className={"submit-loading"}>
        <Spinner>Loading...</Spinner>
        <p>Loading{ellipsis}</p>
      </div>
    </div>
  );
};

export default Submitting;