import React from 'react';
import "../styles/ForgotPassword.scss";
import { NoAccess, TextBkgBox, TextButton } from '../components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { noAccessRedirect } from '../utils/helpers';

const ForgotPassword = (props) => {

  const [email, setEmail] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [noAccess, setNoAccess] = useState(false);
  const navigate = useNavigate();

  // redirect user away from page if user is logged in
  useEffect(() => {
    if (props.loggedIn === true) {
      noAccessRedirect("/dashboard", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate]);

  // remove error message if input is being adjusted
  useEffect(() => {
    setErrMsg('');
  }, [email])

  const resetPassword = () => {
    setErrMsg("This functionality has not been implemented yet");
  };

  return (
    <>{noAccess ? <NoAccess /> :
      <div className={"forgot-pwd"}>
        <div className={"background"}>
          <TextBkgBox>
            <div className="h1">
              Forgot Password
            </div>
            <h4 className={errMsg ? "warning" : "offscreen"} aria-live="assertive">{errMsg}</h4>
            <div className={"inline-flex"}>
              <div className="h3">
                Email:
              </div>
              <input type="text" placeholder="Enter email" className={"input-box"} id="email" onChange={(e) => setEmail(e.target.value)} value={email} required/>
            </div>
            <TextButton onClick={resetPassword} className={"button"}>Reset Password</TextButton>
          </TextBkgBox>
        </div>
      </div>
    }</>
  );
};

export default ForgotPassword;