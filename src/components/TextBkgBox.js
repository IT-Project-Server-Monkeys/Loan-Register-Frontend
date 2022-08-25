import React from "react";
import "../styles/TextBkgBox.scss";

const TextBkgBox = (props) => {
  return (
    <div className={"text-bkg-box"}>{props.children}</div>
  );
};

export default TextBkgBox;
