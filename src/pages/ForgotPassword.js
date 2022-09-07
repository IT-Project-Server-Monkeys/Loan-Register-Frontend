import React from 'react';
import "../styles/ForgotPassword.scss";
import { TextBkgBox, TextButton } from '../components';

const ForgotPassword = (props) => {

  // temporary login handler. generates random data,
  // then passes it onto parent via the onLogin provided by parent
  // TODO remove
  const resetPassword = () => {
    window.location.href='';
  };

  return (
    <div className={"forgot-pwd"}>
      <div className={"background"}>
        <TextBkgBox>
          <div className="h1">
            Forgot Password
          </div>
          <div className={"inline-flex"}>
            <div className="h3">
              Email:
            </div>
            <input type="text" placeholder="Enter username" className={"input-box"}/>
          </div>
          <TextButton onClick={resetPassword} className={"button"}>Reset Password</TextButton>
        </TextBkgBox>
      </div>
    </div>

  );
};

export default ForgotPassword;