import { useRef, useState, useEffect } from 'react';
import "../styles/Login.scss";
import { NoAccess, TextBkgBox, TextButton } from '../components';
import API from "../utils/api";
import bcrypt from 'bcryptjs-react';
import { useMediaQuery } from 'react-responsive';
import { noAccessRedirect } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [noAccess, setNoAccess] = useState(false);
  const navigate = useNavigate();

  const isMobile = useMediaQuery({
    // query: "(max-device-width: 768px)",
    query: "(max-device-width: 850px)",
  });

  // automatically focus on first input box
  useEffect(() => {
    emailRef.current.focus();
  }, [])

  // redirect user away from page if user is logged in
  useEffect(() => {
    if (props.loggedIn === true) {
      noAccessRedirect("/dashboard", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate]);

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

  if (isMobile) {
  
    return (
      <>{noAccess ? <NoAccess /> :
        <div className={"login"}>
          <div className={"background"}>
            <div className={isMobile? "mobile" : ""}>
    
              <TextBkgBox>
                <div className="h1">
                  Log in to LR!
                </div>
                <h4 ref={errRef} className={errMsg ? "warning" : "offscreen"} aria-live="assertive">{errMsg}</h4>
    
                <form onSubmit={handleSubmit}>
                  <div className="mobile-format">
                    <div className="h3">
                      Email:
                    </div>
                    <input type="text" placeholder="Enter email" className={"input-box"} id="email" ref={emailRef} onChange={(e) => setEmail(e.target.value)} value={email} required />
                  </div>
                  <div className="mobile-format">
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
        </div>
      }</>
    );

  } else {

    return (
      <>{noAccess ? <NoAccess /> :
        <div className={"login"}>
          <div className={"background"}>
            <TextBkgBox>
              <div className="h1">
                Log in to LR!
              </div>
              <h4 ref={errRef} className={errMsg ? "warning" : "offscreen"} aria-live="assertive">{errMsg}</h4>

              <form onSubmit={handleSubmit}>
                  <table><tbody>
                    <tr>
                      <td>
                        <div className="h3">
                          Email:
                        </div>
                      </td>
                      <td>
                        <input type="text" placeholder="Enter email" className={"input-box"} id="email" ref={emailRef} onChange={(e) => setEmail(e.target.value)} value={email} required />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div className="h3">
                          Password:
                        </div>
                      </td>
                      <td>
                        <input type="password" placeholder="Enter password" className={"input-box"} id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required />
                      </td>
                    </tr>
                  </tbody></table>
                <a href="/forgot-password" className="a">Forgot password?</a>
                <a href="/signup" className="a">New user?</a>
                <TextButton className={"button"}>Login</TextButton>
              </form>

            </TextBkgBox>
          </div>
        </div>
      }</>
    );

  }

};

export default Login;
