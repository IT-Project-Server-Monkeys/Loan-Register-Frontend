import React from "react";
import "../styles/Global.scss";

// a large button with text, with two alternative styles
const TextButton = (props) => {
  return (
    <button
      className={props.altStyle ? "text-btn-alt" : "text-btn-default"}
      id={props.id} form={props.form} onClick={props.onClick}
      type={props.type} disabled={props.disabled}
      style={{...props.style,
        backgroundColor: props.disabled ? "var(--dark-grey-color)" : null
      }}
    >
      {props.children}
    </button>
  );
};

export default TextButton;

