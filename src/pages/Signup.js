import React from 'react';
import "../styles/Signup.scss";
import { TextBkgBox, TextButton } from '../components';

const Signup = () => {
  return (
    <div className={"sign-up"}>
      <div className={"background"}>
        <TextBkgBox>
          <div className="h1">
            Sign up to LR!
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
          <div className={"inline-flex"}>
            <div className={"wrap"}>
                Confirm password:
            </div>
            <input type="text" placeholder="Enter password" className={"input-box"}/>
          </div>
          <a href="/login" className="a">Existing user?</a>
          <TextButton onClick="" className={"button"}>Sign up</TextButton>
        </TextBkgBox>
      </div>
    </div>
  );
};

export default Signup;
