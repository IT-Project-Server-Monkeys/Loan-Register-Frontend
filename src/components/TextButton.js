import React from "react";
import "../styles/Global.scss";

const TextButton = (props) => {
  return (
    props.altStyle
    ? <button className={"text-btn-alt"}>{props.children}</button>
    : <button className={"text-btn-default"}>{props.children}</button>
  );
};

export default TextButton;
