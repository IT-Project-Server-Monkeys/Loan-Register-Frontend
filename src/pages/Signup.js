import React from 'react';
import "../styles/Signup.scss";
import { Header, NoAccess, Submitting, TextBkgBox, TextButton } from '../components';
import API from "../utils/api";
import { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs-react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { noAccessRedirect } from '../utils/helpers';

const Signup = (props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [noAccess, setNoAccess] = useState(false);
  const navigate = useNavigate();

  const isMobile = useMediaQuery({
    // query: "(max-device-width: 768px)",
    query: "(max-device-width: 850px)",
  });

  // redirect user away from page if user is logged in
  useEffect(() => {
    if (props.loggedIn === true) {
      noAccessRedirect("/dashboard", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate]);

  // remove error message if input is being adjusted
  useEffect(() => {
    setErrMsg('');
  }, [username, email, pwd, confirmPwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let newUser = {};
    setSubmitting(true);

    // disallow leading/trailing spaces in names & categories
    if (/^\s/.test(username) || /\s$/.test(username)) {
      setErrMsg("No leading or trailing spaces in usernames");
      isValid = false;
    }

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
      .catch((err) => {
        // set appropriate error messages if server returns error codes
        if (err.response.status === 405) {
          setErrMsg(err.response.data.message);
        } else if (err.response.status === 406) {
          setErrMsg(err.response.data.message);
        } else {
          setErrMsg("Error");
        }
        // if there is any error messages, prevent redirect
        isValid = false;
      });

    }

    if (isValid === true) {
      // redirect to login page
      window.location.href='/login';
    }
    
    setSubmitting(false);
  }
  
  if (isMobile) {
    return (
      <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
        {noAccess ? <NoAccess /> :
          <div className={"sign-up"}>
            <div className={"background"}>
              <TextBkgBox className={isMobile? "mobile" : ""}>
                <div className="h1">
                  Sign up to LR!
                </div>
                <h4 className={errMsg ? "warning" : "offscreen"} aria-live="assertive">{errMsg}</h4>
      
                <form onSubmit={handleSubmit}>
                  <div className="mobile-format">
                    <div className="h3">
                      Username:
                    </div>
                    <input type="text" placeholder="Enter username" className={"input-box"} id="username" onChange={(e) => setUsername(e.target.value)} value={username} maxLength="20" required/>
                  </div>
                  <div className="mobile-format">
                    <div className="h3">
                      Email:
                    </div>
                    <input type="text" placeholder="Enter email" className={"input-box"} id="email" onChange={(e) => setEmail(e.target.value)} value={email} required/>
                  </div>
                  <div className="mobile-format">
                    <div className="h3">
                        Password:
                    </div>
                    <input type="password" placeholder="Enter password" className={"input-box"} id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required/>
                  </div>
                  <div className="mobile-format">
                    <div className="h3">
                        Confirm password:
                    </div>
                    <input type="password" placeholder="Enter password" className={"input-box"} id="confirm-password" onChange={(e) => setConfirmPwd(e.target.value)} value={confirmPwd} required/>
                  </div>
                  <a href="/login" className="a">Existing user?</a>
                  <TextButton className={"button"}>Sign up</TextButton>
                </form>
              </TextBkgBox>
            </div>
            {submitting ? <Submitting /> : null}
          </div>
        }
      </>
    );

  } else {

    return (
      <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
        {noAccess ? <NoAccess /> :
          <div className={"sign-up"}>
            <div className={"background"}>
              <TextBkgBox style={{height: "700px"}}>
                <div className="h1">
                  Sign up to LR!
                </div>
                <h4 className={errMsg ? "warning" : "offscreen"} aria-live="assertive">{errMsg}</h4>

                <form onSubmit={handleSubmit}>
                  <table><tbody>
                    <tr>
                      <td>
                        <div className="h3">
                          Username:
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="Enter username" className={"input-box"} id="username" onChange={(e) => setUsername(e.target.value)} value={username} maxlength="20" required/>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="h3">
                          Email:
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="Enter email" className={"input-box"} id="email" onChange={(e) => setEmail(e.target.value)} value={email} required/>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="h3">
                            Password:
                        </div>
                      </td>
                      <td>
                        <input type="password" placeholder="Enter password" className={"input-box"} id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required/>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className={"wrap"}>
                            Confirm password:
                        </div>
                      </td>
                      <td>
                        <input type="password" placeholder="Enter password" className={"input-box"} id="confirm-password" onChange={(e) => setConfirmPwd(e.target.value)} value={confirmPwd} required/>
                      </td>
                    </tr>
                  </tbody></table>
                  <a href="/login" className="a">Existing user?</a>
                  <TextButton className={"button"}>Sign up</TextButton>
                </form>
              </TextBkgBox>
            </div>
            {submitting ? <Submitting /> : null}
          </div>
        }
      </>
    );
  }
};

export default Signup;
