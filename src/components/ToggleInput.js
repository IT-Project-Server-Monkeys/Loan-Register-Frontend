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
  const saveInput = async (event) => {
    let valPattern;
    switch (props.type) {
      case "email":
        // eslint-disable-next-line no-useless-escape
        valPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        break;
      case "text":
      default:
        // eslint-disable-next-line no-useless-escape
        valPattern = /.+/
    }

    console.log(curVal);

    if (valPattern.test(curVal)) {
      // TODO axios post request to server
      setEditMode(false);
    }
    else {
      setCurVal(props.initVal);
      alert(`Please enter a valid ${props.field.replace("_", " ")}!`);
    }
    
  }

  return (
    <>
      {
        editMode ?
          <>
            <input
              type={props.type} className={"input-box"}
              value={curVal} onChange={event => setCurVal(event.target.value)}
              placeholder={`New ${props.field.replace("_", " ")}`}
            />
            <button className="toggle" onClick={saveInput}>Save</button>
          </>
        :
          <>
            <p>{curVal}</p>
            <button className="toggle" onClick={() => {setEditMode(true)}}>Change</button>
          </>
      }
    </>
  )
};

export default ToggleInput;
