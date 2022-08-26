import React, { useState } from "react";
import "../styles/ChangePassword.scss";
import { TextBkgBox } from "../components";

const ChangePassword = () => {
  const [submitStyle, setSubmitStyle] = useState({
    backgroundColor: "var(--dark-grey-color)",
  });

  const confirmPwd = (event) => {
    const submitBtn = document.getElementById("submitPwd");
    const newPwd = document.getElementById("newPwd").value;
    if (newPwd && event.target.value === newPwd) {
      submitBtn.disabled = false;
      setSubmitStyle({ backgroundColor: "var(--blue-color)" });
    } else {
      submitBtn.disabled = true;
      setSubmitStyle({ backgroundColor: "var(--dark-grey-color)" });
    }
  };

  return (
    <div className={"change-password"}>
      <TextBkgBox>
        <h1>Change password</h1>
        <form> {/* TODO post route*/}
          <div className={"inline-flex"}>
            <h3>New password:</h3>
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
            <h3>Confirm password:</h3>
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

