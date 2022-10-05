import React, { useState } from "react";

// a text field that switches between display mode and edit mode
const ToggleInput = (props) => {
  const [editMode, setEditMode] = useState(false);

  // upon save, update field & switch back to display mode
  const handleSave = async (event) => {
    event.preventDefault();
    setEditMode(false);
    props.saveInput(props.value);
  }

  return (
    <>
      {
        editMode ?
          <form className={"inline-form"} onSubmit={handleSave}>
            <input required type={props.type} className={"input-box"} value={props.value}
              placeholder={`New ${props.field.replace("_", " ")}`}
              onChange={event => props.setVal(event.target.value.slice(0, props.maxLength))}
            />
            <button className="toggle" type="submit">Save</button>
          </form>
        :
          <>
            <p>{props.value}</p>
            {props.disabled
              ? <button className="toggle-disabled">Change</button>
              : <button className="toggle" onClick={() => {props.onToggle(); setEditMode(true)}}>
                  Change
                </button>
            }
          </>
      }
    </>
  )
};

export default ToggleInput;
