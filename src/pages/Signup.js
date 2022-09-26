import React from 'react';
import "../styles/Signup.scss";
import { TextBkgBox, TextButton } from '../components';
import API from "../utils/api";
import { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // remove error message if input is being adjusted
  useEffect(() => {
    setErrMsg('');
  }, [username, email, pwd, confirmPwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let newUser = {};

    // check if it is a unique username
    await API(`users?display_name=${username}`)
      .then((res) => {

        // if there is no data returned
        if (res.data.length !== 0) {
          setErrMsg("This username is already taken");
          isValid = false;
        }

      })
      .catch((err) => console.log(err));

    // check if it is a unique email
    await API(`users?email=${email}`)
      .then((res) => {

        // if there is no data returned
        if (res.data.length !== 0) {
          setErrMsg("This email already has an account");
          isValid = false;
        }

      })
      .catch((err) => console.log(err));
    
    // check if email is a valid email
    // following regex expression is referenced from https://www.w3resource.com/javascript/form/email-validation.php
    const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!validEmail.test(email)) {
      setErrMsg("Invalid email");
      isValid = false;
    }

    // check if pwd is a secure pwd
    const safePattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!safePattern.test(pwd)) {
      setErrMsg("Password must be at least 8 characters long, and include at least one lowercase letter, one uppercase letter, one number and one symbol");
      isValid = false;
    }

    // check if pwd and confirm pwd are the same
    if (pwd !== confirmPwd) {
      setErrMsg("Passwords don't match");
      isValid = false;
    } 

    if (isValid === true) {

      newUser.display_name = username;
      newUser.login_email = email;

      var hash = bcrypt.hashSync(pwd);
      // hash pwd before sending to db
      newUser.hashed_password = hash;
  
      await API(`/users`, {    
        method: "post",
        data: newUser,
        headers: {"Content-Type": "application/json"}
      })
      .then((res) => {
      })
      .catch((err) => console.log(err));
      
      // redirect to login page
      window.location.href='/login';

    }

  }

  return (
    <div className={"sign-up"}>
      <div className={"background"}>
        <TextBkgBox>
          <div className="h1">
            Sign up to LR!
          </div>
          <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

          <form onSubmit={handleSubmit}>
            <div className={"inline-flex"}>
              <div className="h3">
                Username:
              </div>
              <input type="text" placeholder="Enter username" className={"input-box"} id="username" onChange={(e) => setUsername(e.target.value)} value={username} required/>
            </div>
            <div className={"inline-flex"}>
              <div className="h3">
                Email:
              </div>
              <input type="text" placeholder="Enter email" className={"input-box"} id="email" onChange={(e) => setEmail(e.target.value)} value={email} required/>
            </div>
            <div className={"inline-flex"}>
              <div className="h3">
                  Password:
              </div>
              <input type="password" placeholder="Enter password" className={"input-box"} id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required/>
            </div>
            <div className={"inline-flex"}>
              <div className={"wrap"}>
                  Confirm password:
              </div>
              <input type="password" placeholder="Enter password" className={"input-box"} id="confirm-password" onChange={(e) => setConfirmPwd(e.target.value)} value={confirmPwd} required/>
            </div>
            <a href="/login" className="a">Existing user?</a>
            <TextButton className={"button"}>Sign up</TextButton>
          </form>
        </TextBkgBox>
      </div>
    </div>
  );
};

export default Signup;
