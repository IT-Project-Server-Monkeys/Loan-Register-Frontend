import React, { useState } from "react";
import "../styles/InputDropdown.scss"; // component scoped style

const Deletable = (props) => {
  const [confirmDel, setConfirmDel] = useState();

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
      { props.field == null // confirm w/ user on delete or not depending on if field is set
        ? <button onClick={handleDelete}>&#215;</button>
        : <>
          {confirmDel
            ? <button onClick={handleDelete} onBlurCapture={() => setConfirmDel(false)}>Delete {props.field}?</button>
            : <button onClick={() => {setConfirmDel(true)}}>&#215;</button>
          }
        </>
      }

      
    </div>
  );
};

export default Deletable;
