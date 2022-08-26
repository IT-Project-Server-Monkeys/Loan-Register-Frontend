import React, { useState } from "react";
import "../styles/Account.scss";
// note: used inline styling for specifics since most styles, TODO change?
import { TextBkgBox } from "../components";

const ChangePassword = () => {
  const defaultSubStyle = {
    height: 106,
    marginTop: "1rem",
    fontSize: 48,
    backgroundColor: "var(--dark-grey-color)",
  }
  const [submitStyle, setSubmitStyle] = useState(defaultSubStyle);

  const confirmPwd = (event) => {
    const newPwd = document.getElementById("newPwd").value;
    if (
      newPwd &&
      event.target.value === document.getElementById("newPwd").value
    ) {
      document.getElementById("submitPwd").disabled = false;
      setSubmitStyle({ ...defaultSubStyle, backgroundColor: "var(--blue-color)" });
    } else {
      document.getElementById("submitPwd").disabled = true;
      setSubmitStyle({ ...defaultSubStyle, backgroundColor: "var(--dark-grey-color)" });
    }
  };

  return (
    <div className={"change-password"}>
      <TextBkgBox>
        <h1>Change password</h1>
        <form>
          <div className={"inline-flex"}>
            <h3 style={{ width: 265 }}>New password:</h3>
            {/* TODO onchange confirm check here too? */}
            <input
              id="newPwd"
              name="newPwd"
              type="password"
              placeholder="Enter password"
              className={"input-box"}
            />
          </div>
          <div className={"inline-flex"}>
            <h3 style={{ width: 265 }}>Confirm password:</h3>
            <input
              onChange={confirmPwd}
              type="password"
              placeholder="Enter password"
              className={"input-box"}
            />
          </div>
          <button style={submitStyle} disabled id="submitPwd" type="submit">
            Confirm
          </button>
        </form>
      </TextBkgBox>
    </div>
  );
};

export default ChangePassword;

