import React from 'react';
import "../styles/Signup.scss";
import { TextBkgBox, TextButton } from '../components';
import API from "../utils/api";
import { useState, useEffect } from 'react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // remove error message if input is being adjusted
  useEffect(() => {
    setErrMsg('');
  }, [email, pwd, confirmPwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let newUser = {};
    let defaultCategories = ["Electronics", "Books", "Stationary", "University Resources",
                              "Cash", "Miscellaneous", "Personal", "Clothing and Apparel",
                              "Toiletries and Beauty"];
    let randomUsername = Math.random().toString(16).substring(2, 10);

    // TODO: check if email is unique
    // TODO: hash passwords

    // check if pwd and confirm pwd are the same
    if (pwd !== confirmPwd) {
      setErrMsg("Passwords don't match");
      isValid = false;
    } 
    
    if (isValid === true) {
      // randomly generate username
      newUser.display_name = randomUsername;
      newUser.login_email = email;
      newUser.hashed_password = pwd;
      newUser.item_categories = defaultCategories;
  
      await API(`/users`, {    
        method: "post",
        data: newUser,
        headers: {"Content-Type": "application/json"}
      })
      .then((res) => {
        console.log(res);
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
            <TextButton onClick="" className={"button"}>Sign up</TextButton>
          </form>
        </TextBkgBox>
      </div>
    </div>
  );
};

export default Signup;
