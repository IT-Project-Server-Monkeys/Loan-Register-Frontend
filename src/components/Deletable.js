import React, { useState } from "react";
import "../styles/InputDropdown.scss"; // component scoped style

// a clickable and removable suggestion to be used in an InputDropdown
const Deletable = (props) => {
  const [confirmRmv, setConfirmRmv] = useState();

  // selecting this suggestion
  const handleSelect = (e) => {
    e.preventDefault();
    props.selectOption(props.children);
  }

  // removing this suggestion
  const handleRemove = (e) => {
    e.preventDefault();
    if (props.canDel) props.deleteOption(props.children);
    else props.hideOption(props.children);
  }
  return (
    <div className="deletable">
      <button onClick={handleSelect}>{props.children}</button>
      {
        props.askRm
        ?
          props.field == null // confirm w/ user on delete or not depending on if field is set
          ? <button onClick={handleRemove}>&#215;</button>
          : <>
            {confirmRmv
              ? <button onClick={handleRemove} onBlurCapture={() => setConfirmRmv(false)}>
                {props.canDel ? "Delete " : "Hide "}{props.field}?
              </button>
              : <button onClick={() => {setConfirmRmv(true)}}>&#215;</button>
            }
          </>
          
        :
          <button onClick={handleRemove}>&#215;</button>
      }
    </div>
  );
};

export default Deletable;
