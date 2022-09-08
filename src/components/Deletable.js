import React, { useState } from "react";
import "../styles/InputDropdown.scss"; // component scoped style

const Deletable = (props) => {
  const [confirmRmv, setConfirmRmv] = useState();

  const handleSelect = (e) => {
    e.preventDefault();
    props.selectOption(props.children);
  }
  const handleRemove = (e) => {
    e.preventDefault();
    if (props.canDel) props.deleteOption(props.children);
    else props.hideOption(props.children);
  }
  return (
    <div className="deletable">
      <button onClick={handleSelect}>{props.children}</button>
      { props.field == null // confirm w/ user on delete or not depending on if field is set
        ? <button onClick={handleRemove}>&#215;</button>
        : <>
          {confirmRmv
            ? <button onClick={handleRemove} onBlurCapture={() => setConfirmRmv(false)}>
              {props.canDel ? "Delete " : "Hide "}{props.field}?
            </button>
            : <button onClick={() => {setConfirmRmv(true)}}>&#215;</button>
          }
        </>
      }

      
    </div>
  );
};

export default Deletable;
