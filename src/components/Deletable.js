import React from "react";
import "../styles/InputDropdown.scss"; // component scoped style

const Deletable = (props) => {
  const handleSelect = (e) => {
    e.preventDefault();
    props.selectOption(props.children);
  }
  const handleDelete = (e) => {
    e.preventDefault();
    props.deleteOption(props.children)
  }
  return (
    <div className="deletable">
      <button onClick={handleSelect}>{props.children}</button>
      <button onClick={handleDelete}>&#215;</button>
    </div>
  );
};

export default Deletable;
