import React, { useState } from "react";
import "../styles/ToggleInput.scss";

const ToggleInput = (props) => {
  const [editMode, setEditMode] = useState(false);

  if (editMode) return (
    <>
      <input type="text" placeholder={`New ${props.field.replace("_", " ")}`} className={"input-box"}/>
      <button onClick={() => {setEditMode(false)}}>Save</button>
    </>
  );
  else return (
    <>
      <p>{props.initVal}</p>
      <button onClick={() => {setEditMode(true)}}>Change</button>
    </>
  );
};

export default ToggleInput;
