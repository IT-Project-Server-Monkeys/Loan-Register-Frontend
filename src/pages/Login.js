import { useRef, useState, useEffect } from 'react';
import "../styles/Login.scss";
import { TextBkgBox, TextButton } from '../components';
import API from "../utils/api";

const Login = (props) => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // automatically focus on first input box
  useEffect(() => {
    userRef.current.focus();
  }, [])

  // remove error message if user or pwd input is being adjusted
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(user, pwd);
    let uid = null;

    await API(`users?password=${pwd}&email=${user}`)
      .then((res) => {
        console.log(res);
        uid = res.data[0]._id;
        console.log(uid); 
      })
      .catch((err) => console.log(err));

    //const uid = res?.data[0]._id;
    //console.log(uid); 
    
    if (uid != null) {
      props.onLogin(uid);
      window.location.href='/dashboard/loaner';
      setUser('');
      setPwd('');

    } else {
      setErrMsg('Login Failed');
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
                Username:
              </div>
              <input type="text" placeholder="Enter username" className={"input-box"} id="username" ref={userRef} onChange={(e) => setUser(e.target.value)} value={user} required />
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
