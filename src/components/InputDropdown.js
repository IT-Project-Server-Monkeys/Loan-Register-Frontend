import React from "react";
import "../styles/InputDropdown.scss"; // component scoped style

const Footer = (props) => {
  return (
    <div className={"input-dropdown"}>{props.children}</div>
  );
};

export default Footer;
