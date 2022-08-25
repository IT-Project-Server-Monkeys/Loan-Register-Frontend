import React, { useState, useEffect } from "react";
import "../styles/ToggleInput.scss";

// field that switches between display mode and edit mode
const ToggleInput = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [curVal, setCurVal] = useState();
  
  // initialise fields
  useEffect(() => {
    setCurVal(props.initVal);
  }, [props]);

  // upon save, update field & switch back to display mode
  const saveInput = async () => {
    console.log(curVal);
    // TODO axios post request to server
    setEditMode(false);
  }
  
  if (editMode) return ( // editable field + save button
    <>
      <input
        type="text" className={"input-box"}
        value={curVal} onChange={event => setCurVal(event.target.value)}
        placeholder={`New ${props.field.replace("_", " ")}`}
      />
      <button className="toggle" onClick={saveInput}>Save</button>
    </>
  );
  else return ( // display field + edit button
    <>
      <p>{curVal}</p>
      <button className="toggle" onClick={() => {setEditMode(true)}}>Change</button>
    </>
  );
};

export default ToggleInput;
