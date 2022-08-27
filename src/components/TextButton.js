import React from "react";
import "../styles/Global.scss";

const TextButton = (props) => {
  return (
    <button
      className={props.altStyle ? "text-btn-alt" : "text-btn-default"}
      onClick={props.onClick}
      id={props.id}
      style={props.style}
      type={props.type}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default TextButton;

