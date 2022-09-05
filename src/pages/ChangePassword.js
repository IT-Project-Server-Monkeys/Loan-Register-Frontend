import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChangePassword.scss";
import { TextBkgBox, TextButton } from "../components";
import axios from "axios";

const ChangePassword = (props) => {
  const redirect = useNavigate();
  const [letSubmit, setLetSubmit] = useState(false);

  const confirmPwd = () => {
    const newPwd = document.getElementById("newPwd").value;
    const confirmPwd = document.getElementById("confirmPwd").value;
    setLetSubmit(newPwd && confirmPwd === newPwd);
  };

  const changePwd = async (event) => {
    event.preventDefault();
    let newPwd = document.getElementById("newPwd");
    // TODO hash password
    let formData = {_id: props.uid, hashed_password: newPwd.value};
    console.log(formData);

    await axios({
      method: "put", data: formData,
      url: "https://server-monkeys-backend-test.herokuapp.com/testingUser",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    
    newPwd.value = null;
    document.getElementById("confirmPwd").value = null;
    confirmPwd();

    redirect("/account");
  };

  return (
    <div className={"change-password"}>
      <TextBkgBox>
        <h1>Change password</h1>
        <form onSubmit={changePwd} onChange={confirmPwd}>
          <div className={"inline-flex"}>
            <h3>New password:</h3>
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
          <TextButton disabled={!letSubmit} type="submit">
            Confirm
          </TextButton>
        </form>
      </TextBkgBox>
    </div>
  );
};

export default ChangePassword;

