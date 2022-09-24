import React from "react";
import "../styles/TextBkgBox.scss";

// a box with text in it
const TextBkgBox = (props) => {
  return (
    <div className={"text-bkg-box"}>{props.children}</div>
  );
};

export default TextBkgBox;
