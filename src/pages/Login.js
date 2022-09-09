import React from 'react';
import styles from "../styles/Login.module.scss";
import { TextBkgBox, TextButton } from '../components';

const Login = (props) => {

  // temporary login handler. generates random data,
  // then passes it onto parent via the onLogin provided by parent
  // TODO remove
  const handleLogin = () => {
    props.onLogin("62fd96e4f0339bd9af7e9b0c");
    window.location.href='/dashboard/loaner';
  };

  return (
    <div className={`${styles.background}`}>
      <TextBkgBox>
        <div className="h1">
          Log in to LR!
        </div>
        <div className={"inline-flex"}>
          <div className="h3">
            Username:
          </div>
          <input type="text" placeholder="Enter username" className={"input-box"}/>
        </div>
        <div className={"inline-flex"}>
          <div className="h3">
              Password:
          </div>
          <input type="text" placeholder="Enter password" className={"input-box"}/>
        </div>
        <a href="/signup" className="a">Forgot password?</a>
        <a href="/signup" className="a">New user?</a>
        <TextButton onClick={handleLogin} className={`${styles.button}`}>Login</TextButton>
      </TextBkgBox>
    </div>
  );
};

export default Login;
