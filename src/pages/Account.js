import React, { useEffect, useState } from "react";
import '../styles/Account.scss'
import { TextBkgBox, ToggleInput, TextButton, Loading, NoAccess, Header } from '../components';
import { checkAPI, API } from '../utils/api';
import { Link, useNavigate } from "react-router-dom";
import { noAccessRedirect } from "../utils/helpers";
import { useMediaQuery } from "react-responsive";

const Account = (props) => {
  // page navigation
  const [noAccess, setNoAccess] = useState(false);
  const navigate = useNavigate();
  const isTablet = useMediaQuery({ maxDeviceWidth: 1080 });
  const isMobile = useMediaQuery({ maxDeviceWidth: 670 });

  // form submission
  const [nameSub, setNameSub] = useState(false);
  const [emailSub, setEmailSub] = useState(false);
  const [warning, setWarning] = useState("");

  // form data
  const [userInfo, setUserInfo] = useState({});
  const [newName, setNewName] = useState(<Loading />);
  const [newEmail, setNewEmail] = useState(<Loading />);

  // if the entered display name is not unique, show warning
  // else, submit data to the server
  const saveName = async (name) => {
    // disallow further edit until server GET & PUT requests have been completed
    setNameSub(true);
    setNewName(<Loading />);

    let fetchedData = [];
    const failAlert = "There was an error saving your username. Please try again later.";
    const onFail = () => { setNewName(userInfo.display_name); alert(failAlert); }

    // disallow leading/trailing spaces
    if (/^\s/.test(name) || /\s$/.test(name)) {
      setWarning("No trailing or leading whitespaces allowed in username.");
      setNameSub(false);
      setNewName(userInfo.display_name);
      return;
    }

    await checkAPI(
      async () => {
        console.log("token valid -> check for duplicate username & save username");
        
        await API.get(`/users?display_name=${name}`)
          .then((res) => {fetchedData = res.data})
          .catch((err) => { console.log(err); fetchedData = false; });
    
        if (fetchedData === false) onFail();
        else if (fetchedData.length === 0 || fetchedData[0]._id === props.uid) {
          let formData = { _id: props.uid, display_name: name};
          await API(`/users`, {
            method: "put", data: formData,
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => {
              console.log(res);
              setNewName(name);
              setUserInfo((info) => {return {...info, display_name: name}});
            })
            .catch((err) => { console.log(err); onFail(); });
        } else {
          setWarning(`The username "${name}" is taken.`);
          setNewName(userInfo.display_name);
        }

        setNameSub(false);
      },

      () => { // invalid tokens
        noAccessRedirect("/login", navigate, setNoAccess, props.onLogout);
        console.log("Session expired");
      }
    );
  }

  // if the entered login email is not unique, show warning
  // else, submit data to the server
  const saveEmail = async (email) => {
    // disallow further edit until server GET & PUT requests have been completed
    setEmailSub(true);
    setNewEmail(<Loading />);

    let fetchedData = [];
    const failAlert = "There was an error saving your login email. Please try again later.";
    const onFail = () => { setNewEmail(userInfo.login_email); alert(failAlert); }

    await checkAPI(
      async () => {
        console.log("token valid -> check for duplicate email & save email");
    
        await API.get(`/users?email=${email}`)
          .then((res) => {fetchedData = res.data})
          .catch((err) => { console.log(err); fetchedData = false; });
    
        if (fetchedData === false) onFail();
        else if (fetchedData.length === 0 || fetchedData[0]._id === props.uid) {
          let formData = { _id: props.uid, login_email: email};
          await API(`/users`, {
            method: "put", data: formData,
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => {
              console.log(res);
              setNewEmail(email);
              setUserInfo((info) => {return {...info, login_email: email}});
            })
            .catch((err) => { console.log(err); onFail() });
        } else {
          setWarning(`The login email ${email} is taken.`);
          setNewEmail(userInfo.login_email);
        }
        setEmailSub(false);
      },
      () => { // invalid tokens
        noAccessRedirect("/login", navigate, setNoAccess, props.onLogout);
        console.log("Session expired");
      }
    );

  }

  // redirect user away from page if user is not logged in
  useEffect(() => {
    if (props.loggedIn === false) {
      noAccessRedirect("/login", navigate, setNoAccess);
    }
  }, [props.loggedIn, navigate])

  // get user data from server, querying using userId recorded in the app's session
  useEffect(() => {
    if (props.loggedIn !== true || props.uid == null || props.onLogout == null) return;
    const fetchUser = async () => {
      let fetchedData = null;

      await API.get(`/users?id=${props.uid}`)
      .then((res) => fetchedData = res.data)
      .catch((err) => console.log(err));

      if (fetchedData == null) fetchedData = [{
        _id: props.uid,
        display_name: "Retrieval Failed"
      }];
      
      setUserInfo(fetchedData);
      setNewName(fetchedData.display_name);
      setNewEmail(fetchedData.login_email);
    };

    checkAPI(
      () => {
        console.log("token valid -> fetch user data") 
        fetchUser();
      },
      () => {
        noAccessRedirect("/login", navigate, setNoAccess, props.onLogout);
        console.log("Session expired");
      }
    );
  }, [props, navigate]);

  return (
    <><Header loggedIn={props.loggedIn} onLogout={props.onLogout} />
      {noAccess ? <NoAccess /> :
        <div className={`account-page ${isTablet ? isMobile ? "mobile" : "tablet" : ""}`}>
          <TextBkgBox className={isTablet ? isMobile ? "mobile" : "tablet" : ""}>
            <h1>Account</h1>
            <table><tbody>
              {isTablet
                ? 
                  <>
                    <tr className={isTablet ? isMobile ? "mobile" : "tablet" : ""}>
                      <td><h3>Username:</h3></td>
                    </tr>
                    <tr className={isTablet ? isMobile ? "mobile" : "tablet" : ""}>
                      <td className="toggle-input">
                        <ToggleInput disabled={ nameSub || emailSub } saveInput={saveName} type="text"
                          onToggle={() => setWarning("")} maxLength={20} isMobile={isMobile}
                          field="display_name" value={newName} setVal={setNewName}
                        />
                      </td>
                    </tr>
                  </>
                :
                  <tr className={isTablet ? isMobile ? "mobile" : "tablet" : ""}>
                    <td><h3>Username:</h3></td>
                    <td className="toggle-input">
                      <ToggleInput disabled={ nameSub || emailSub } saveInput={saveName} type="text"
                        onToggle={() => setWarning("")} maxLength={20} isMobile={isMobile}
                        field="display_name" value={newName} setVal={setNewName}
                      />
                    </td>
                  </tr>
              }

              {
                isTablet
                ?
                  <>
                    <tr className={isTablet ? isMobile ? "mobile" : "tablet" : ""}>
                      <td><h3>Email:</h3></td>
                    </tr>
                    <tr className={isTablet ? isMobile ? "mobile" : "tablet" : ""}>
                      <td className="toggle-input">
                        <ToggleInput disabled={ nameSub || emailSub } saveInput={saveEmail}
                          setVal={setNewEmail} isMobile={isMobile} type="email"
                          field="login_email" value={newEmail} onToggle={() => setWarning("")}
                        />
                      </td>
                    </tr>
                  </>
                :
                  <tr>
                    <td><h3>Email:</h3></td>
                    <td className="toggle-input">
                      <ToggleInput disabled={ nameSub || emailSub } saveInput={saveEmail}
                        setVal={setNewEmail} isMobile={isMobile} type="email"
                        field="login_email" value={newEmail} onToggle={() => setWarning("")}
                      />
                    </td>
                  </tr>
              }

            </tbody></table>

            <h4 className="warning">{warning}</h4>
            <Link to="/change-password">
              <TextButton disabled={ nameSub || emailSub } type="button"
                style={isMobile ? {fontSize: "30px"} : {}}
              >
                Change password
              </TextButton>
            </Link>
          </TextBkgBox>
        </div>
      }
    </>
  );
};

export default Account;
