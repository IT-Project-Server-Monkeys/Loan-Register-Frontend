import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../context/AuthProvider";
import "../styles/Login.scss";
import { TextBkgBox, TextButton } from '../components';
import axios from 'axios';

const Login = (props) => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

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
    console.log(user, pwd);

    try {
      const response = await axios({
        method: "post", data: {display_name: user, hashed_password: pwd},
        url: "https://server-monkeys-backend-test.herokuapp.com/testingUser",
        headers: { "Content-Type": "application/json" },
      })
      
      // const response = await axios.post("https://server-monkeys-backend-test.herokuapp.com/testingUser",
      //   JSON.stringify({display_name: user, hashed_password: pwd}),
      //   {
      //     header: { 'Content-Type': 'application/json'},
      //     //withCredentials: true
      //   }
      // );
      // console.log(JSON.stringify(response?.data));

      const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      setAuth({ user, pwd, accessToken });
      setUser('');
      setPwd('');
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }


  }


  // temporary login handler. generates random data,
  // then passes it onto parent via the onLogin provided by parent
  // TODO remove
  //const handleLogin = () => {
    //props.onLogin({ userId: "62fd8a9df04410afbc6df31f" });
    //window.location.href='/dashboard/loaner';
  //};

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
