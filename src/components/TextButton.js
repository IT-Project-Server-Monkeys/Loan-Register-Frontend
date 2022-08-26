import React from "react";
import "../styles/Global.scss";

const TextButton = (props) => {
  return props.altStyle ? (
    <button
      className={"text-btn-alt"}
      onClick={props.onClick}
      id={props.id}
      style={props.style}
      type={props.type}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  ) : (
    <button
      className={"text-btn-default"}
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

