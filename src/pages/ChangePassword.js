import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ChangePassword.scss";
import { TextBkgBox, TextButton, Submitting, NoAccess } from "../components";
import API from '../utils/api';
import bcrypt from 'bcryptjs-react';
import { noAccessRedirect } from "../utils/helpers";
import { useMediaQuery } from "react-responsive";

const ChangePassword = (props) => {
  // page navigation
  const [noAccess, setNoAccess] = useState(false);
  const navigate = useNavigate();
  
  // form submission
  const safePattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const [letSubmit, setLetSubmit] = useState(false);
  const [safetyNote, setSafetyNote] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // responsive
  const isMobile = useMediaQuery({ maxDeviceWidth: 760 });

  // check if the password has bene retyped in confirm input
  const confirmPwd = () => {
    const newPwd = document.getElementById("newPwd").value;
    const confirmPwd = document.getElementById("confirmPwd").value;
    setLetSubmit(newPwd && confirmPwd === newPwd);
  };

  // submit the new password to the server
  const changePwd = async (event) => {
    event.preventDefault();
    
    // do not submit if password is unsafe
    let newPwd = document.getElementById("newPwd").value;
    if (!safePattern.test(newPwd)) {
      setSafetyNote(true);
      document.getElementById("newPwd").value = "";
      document.getElementById("confirmPwd").value = "";
      
    } else {
      // block the screen and send the data to the server
      setSubmitting(true);
      
      let formData = {
        _id: props.uid,
        hashed_password: bcrypt.hashSync(newPwd)
      };
      console.log(formData);

      await API(`/users`, {
        method: "put", data: formData,
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => { console.log(res); navigate("/account"); })
        .catch((err) => {
          console.log(err);
          alert("There was an error saving your password. Please try again later.");
        });

      setSubmitting(false);
    }
  };

  // redirect user away from page if user is not logged in
  useEffect(() => {
    if (props.loggedIn === false) {
      noAccessRedirect("/login", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate])

  return (
    <>{noAccess ? <NoAccess /> :
      <div className={`change-password ${isMobile ? "mobile" : ""}`}>
        <TextBkgBox className={isMobile ? "mobile" : ""}>
          <h1>Change password</h1>
          <form onSubmit={changePwd} onChange={confirmPwd}>
            {safetyNote ? <span className={"safety-note"}>
              Password must contain at least: a symbol, a number, a lowercase letter and an uppercase letter.
            </span> : null}
            <table><tbody>
              { isMobile
                ?
                  <>
                    <tr>
                      <td><h3 className="mobile">New password:</h3></td>
                    </tr>
                    <tr>
                      <td>
                        <input required type="password" id="newPwd" minLength={8}
                          placeholder="Min. 8 characters" className={"input-box mobile"}
                        />
                      </td>
                    </tr>
                  </>
                :
                  <tr>
                    <td><h3>New password:</h3></td>
                    <td>
                      <input required type="password" id="newPwd" minLength={8}
                        placeholder="Min. 8 characters" className={"input-box"}
                      />
                    </td>
                  </tr>
              }

              { isMobile
                ?
                  <>
                    <tr>
                      <td><h3 className="mobile">Confirm password:</h3></td>
                    </tr>
                    <tr>
                      <td>
                        <input required type="password" id="confirmPwd"
                          placeholder="Re-type password" className={"input-box mobile"}
                        />
                      </td>
                    </tr>
                  </>
                :
                  <tr>
                    <td><h3>Confirm password:</h3></td>
                    <td>
                      <input required type="password" id="confirmPwd"
                        placeholder="Re-type password" className={"input-box"}
                      />
                    </td>
                  </tr>
              }
              <tr><td colspan="2" style={{textAlign: "center"}}>
                <TextButton disabled={!letSubmit} type="submit">Confirm</TextButton>
              </td></tr>
            </tbody></table>
          </form>
        </TextBkgBox>
        {submitting ? <Submitting /> : null}
      </div>
    }</>
  );
};

export default ChangePassword;

