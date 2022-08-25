import React, { useState, useEffect } from "react";
import "../styles/ToggleInput.scss";

const ToggleInput = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [curVal, setCurVal] = useState();

  const saveInput = async () => {
    console.log(curVal);
    // TODO axios post request to server
    setEditMode(false);
  }

  useEffect(() => {
    setCurVal(props.initVal);
  }, [props]);

  if (editMode) return (
    <>
      <input
        type="text" className={"input-box"}
        value={curVal} onChange={event => setCurVal(event.target.value)}
        placeholder={`New ${props.field.replace("_", " ")}`}
      />
      <button className="toggle" onClick={saveInput}>Save</button>
    </>
  );
  else return (
    <>
      <p>{curVal}</p>
      <button className="toggle" onClick={() => {setEditMode(true)}}>Change</button>
    </>
  );
};

export default ToggleInput;
