import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChangePassword.scss";
import { TextBkgBox, TextButton, Submitting } from "../components";
import API from '../utils/api';

const ChangePassword = (props) => {
  const safePattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const redirect = useNavigate();
  const [letSubmit, setLetSubmit] = useState(false);
  const [safetyNote, setSafetyNote] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const confirmPwd = () => {
    const newPwd = document.getElementById("newPwd").value;
    const confirmPwd = document.getElementById("confirmPwd").value;
    setLetSubmit(newPwd && confirmPwd === newPwd);
  };

  const changePwd = async (event) => {
    event.preventDefault();
    
    let newPwd = document.getElementById("newPwd").value;
    if (!safePattern.test(newPwd)) {
      setSafetyNote(true);
      document.getElementById("newPwd").value = "";
      document.getElementById("confirmPwd").value = "";
      return;
      
    } else {

      // TODO hash password

      setSubmitting(true);
      
      let formData = {_id: props.uid, hashed_password: newPwd};
      console.log(formData);

      await API(`/users`, {
        method: "put", data: formData,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      redirect("/account");
    }
  };

  return (
    <div className={"change-password"}>
      <TextBkgBox>
        <h1>Change password</h1>
        <form onSubmit={changePwd} onChange={confirmPwd}>
          {safetyNote ? <span className={"safety-note"}>
            Password must contain at least: a symbol, a number, a lowercase letter and an uppercase letter.
          </span> : null}
          <div className={"inline-flex"}>
            <h3>New password:</h3>
            <input required type="password" id="newPwd" minLength={8}
              placeholder="(Minimum 8 characters.)" className={"input-box"}
            />
          </div>
          <div className={"inline-flex"}>
            <h3>Confirm password:</h3>
            <input required type="password" id="confirmPwd"
              placeholder="Same password as above" className={"input-box"}
            />
          </div>
          <TextButton disabled={!letSubmit} type="submit">
            Confirm
          </TextButton>
        </form>
      </TextBkgBox>
      <Submitting style={submitting ? {display: "flex"} : {display: "none"}} />
    </div>
  );
};

export default ChangePassword;

