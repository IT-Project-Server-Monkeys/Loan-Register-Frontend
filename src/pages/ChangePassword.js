import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChangePassword.scss";
import { TextBkgBox, TextButton } from "../components";
// import axios from "axios";

const ChangePassword = (props) => {
  const [submitStyle, setSubmitStyle] = useState({
    backgroundColor: "var(--dark-grey-color)",
  });

  const redirect = useNavigate();

  const confirmPwd = () => {
    const submitBtn = document.getElementById("submitPwd");
    const newPwd = document.getElementById("newPwd").value;
    const confirmPwd = document.getElementById("confirmPwd").value;
    if (newPwd && confirmPwd === newPwd) {
      submitBtn.disabled = false;
      setSubmitStyle({ backgroundColor: "var(--blue-color)" });
    } else {
      submitBtn.disabled = true;
      setSubmitStyle({ backgroundColor: "var(--dark-grey-color)" });
    }
  };

  const changePwd = async (event) => {
    event.preventDefault();

    const newPwd = document.getElementById("newPwd");

    newPwd.value = null;
    document.getElementById("confirmPwd").value = null;
    confirmPwd();

    // TODO server implement patch request
    // await axios.patch(`https://server-monkeys-backend-test.herokuapp.com/users/${props.loginSession.userId}`,
    // { hashed_password: newPwd.value }, { transformRequest: [data => data[0]] })
    //   .then((res) => console.log(res)).catch((err) => console.log(err));

    redirect("/account");
  };

  return (
    // TODO: consider bootstrap form
    <div className={"change-password"}>
      <TextBkgBox>
        <h1>Change password</h1>
        <form onSubmit={changePwd} onChange={confirmPwd}>
          {" "}
          {/* TODO post route*/}
          <div className={"inline-flex"}>
            <h3>New password:</h3>
            {/* TODO consider onchange confirm check here too? */}
            <input required type="password" id="newPwd"
              placeholder="Enter password" className={"input-box"}
            />
          </div>
          <div className={"inline-flex"}>
            <h3>Confirm password:</h3>
            <input required type="password" id="confirmPwd"
              placeholder="Confirm password" className={"input-box"}
            />
          </div>
          <TextButton disabled style={submitStyle} id="submitPwd" type="submit">
            Confirm
          </TextButton>
        </form>
      </TextBkgBox>
    </div>
  );
};

export default ChangePassword;

