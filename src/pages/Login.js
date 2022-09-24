import { useRef, useState, useEffect } from 'react';
import "../styles/Login.scss";
import { TextBkgBox, TextButton } from '../components';
import API from "../utils/api";
import bcrypt from 'bcryptjs';

const Login = (props) => {
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // automatically focus on first input box
  useEffect(() => {
    emailRef.current.focus();
  }, [])

  // remove error message if user or pwd input is being adjusted
  useEffect(() => {
    setErrMsg('');
  }, [email, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uid = null;
    let hash = null;

    // check if pwd given matches with hashed password
    await API(`users?email=${email}`)
    .then((res) => {

      // if there is no data returned
      if (res.data.length !== 0) {
        hash = res.data[0].hashed_password;
        uid = res.data[0]._id;
      }

    })
    .catch((err) => console.log(err));

    if (hash != null) {
      // if there is a password, compare both passwords
      bcrypt.compare(pwd, hash).then((res) => {
        if (res === true) {
          props.onLogin(uid);
          window.location.href='/dashboard';
          setEmail('');
          setPwd('');
        } else {
          setErrMsg('Incorrect Credentials');
          errRef.current.focus();
        }
      });
    } else {
      setErrMsg('Incorrect Credentials');
      errRef.current.focus();
    }

  }

  return (
    <div className={"login"}>
      <div className={"background"}>
        <TextBkgBox>
          <div className="h1">
            Log in to LR!
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

          <form onSubmit={handleSubmit}>
            <div className={"inline-flex"}>
              <div className="h3">
                Email:
              </div>
              <input type="text" placeholder="Enter email" className={"input-box"} id="email" ref={emailRef} onChange={(e) => setEmail(e.target.value)} value={email} required />
            </div>
            <div className={"inline-flex"}>
              <div className="h3">
                Password:
              </div>
              <input type="password" placeholder="Enter password" className={"input-box"} id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required />
            </div>
            <a href="/forgot-password" className="a">Forgot password?</a>
            <a href="/signup" className="a">New user?</a>
            <TextButton className={"button"}>Login</TextButton>
          </form>

        </TextBkgBox>
      </div>
    </div>

  );
};

export default Login;
