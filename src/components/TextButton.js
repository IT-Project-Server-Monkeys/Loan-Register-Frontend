import React from "react";
import "../styles/Global.scss";

const TextButton = (props) => {
  return (
    <button
      className={props.altStyle ? "text-btn-alt" : "text-btn-default"}
      style={props.style} onClick={props.onClick}
      id={props.id} form={props.form}
      type={props.type} disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default TextButton;

