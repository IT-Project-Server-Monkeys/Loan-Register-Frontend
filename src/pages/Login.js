import { useRef, useState, useEffect } from 'react';
import "../styles/Login.scss";
import { Header, NoAccess, Submitting, TextBkgBox, TextButton } from '../components';
import { API } from "../utils/api";
import bcrypt from 'bcryptjs-react';
import { useMediaQuery } from 'react-responsive';
import { noAccessRedirect } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
  const emailRef = useRef();
  const errRef = useRef();
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [noAccess, setNoAccess] = useState([false, false]);
  const navigate = useNavigate();

  const isMobile = useMediaQuery({
    // query: "(max-device-width: 768px)",
    query: "(max-device-width: 850px)",
  });

  // automatically focus on first input box
  useEffect(() => {
    if (!noAccess[0]) emailRef.current.focus();
  }, [noAccess])

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
    let hash = null;
    let accessToken = null;
    let refreshToken = null;


    setSubmitting(true);

    // get hased pwd and jwt tokens from backend
    await API({
      method: 'POST',
      url: '/login',
      data: {
        login_email: email
      }
    })
    .then((res) => {
      // console.log(res)
      hash = res.data.hashed_password;
      accessToken = res.data.accessToken
      refreshToken = res.data.refreshToken
    })
    .catch((err) => {
      console.log('error', err)
    });

    // check if pwd given matches with hashed password
    if (hash != null) {
      // if there is a password, compare both passwords
      bcrypt.compare(pwd, hash).then((res) => {
        if (res === true) {          
          setEmail('');
          setPwd('');

          // store jwt tokens
          window.sessionStorage.setItem("sessionStart", Date.now());
          window.sessionStorage.setItem("accessToken", accessToken);
          window.sessionStorage.setItem("refreshToken", refreshToken);
          
          window.location.href = "/dashboard"

        } else {
          // wrong password
          setErrMsg('Incorrect Credentials');
          errRef.current.focus();
        }
      });
    } else {
      // user not exsit
      setErrMsg('Incorrect Credentials');
      errRef.current.focus();
    }

    setSubmitting(false);

  }

  if (isMobile) {
  
    return (
      <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
        {noAccess[0] ? <NoAccess sessionExpired={noAccess[1]} /> :
          <div className={"login"}>
            <div className={"background"}>
              <TextBkgBox className={isMobile ? "mobile" : ""}>
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
            {submitting ? <Submitting /> : null}
          </div>
        }
      </>
    );

  } else {

    return (
      <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
        {noAccess[0] ? <NoAccess sessionExpired={noAccess[1]} /> :
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
            {submitting ? <Submitting /> : null}
          </div>
        }
      </>
    );

  }

};

export default Login;
