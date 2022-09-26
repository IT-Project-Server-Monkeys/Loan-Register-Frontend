import React, { useEffect, useState } from "react";
import '../styles/Account.scss'
import { TextBkgBox, ToggleInput, TextButton, Loading } from '../components';
import API from '../utils/api';
import { useNavigate } from "react-router-dom";

const Account = (props) => {
  // page navigation
  const navigate = useNavigate();

  // form submission
  const [nameSub, setNameSub] = useState(false);
  const [emailSub, setEmailSub] = useState(false);
  const [nameWarn, setNameWarn] = useState("");
  const [emailWarn, setEmailWarn] = useState("");

  // form data
  const [userInfo, setUserInfo] = useState({});
  const [newName, setNewName] = useState(<Loading />);
  const [newEmail, setNewEmail] = useState(<Loading />);

  // if the entered display name is not unique, show warning
  // else, submit data to the server
  const saveName = async (name) => {
    let fetchedData = [];
    const failAlert = "There was an error saving your username. Please try again later.";
    const onFail = () => { setNewName(userInfo.display_name); alert(failAlert); }
    
    // disallow further edit until server GET & PUT requests have been completed
    setNameSub(true);
    setNewName(<Loading />);
    
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
        .then((res) => { console.log(res); setNewName(name); })
        .catch((err) => { console.log(err); onFail(); });
      setNameWarn("");
    } else {
      setNameWarn(name);
      setNewName(userInfo.display_name);
    }

    setNameSub(false);
  }

  // if the entered login email is not unique, show warning
  // else, submit data to the server
  const saveEmail = async (email) => {
    let fetchedData = [];
    const failAlert = "There was an error saving your login email. Please try again later.";
    const onFail = () => { setNewEmail(userInfo.login_email); alert(failAlert); }

    // disallow further edit until server GET & PUT requests have been completed
    setEmailSub(true);
    setNewEmail(<Loading />);

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
        .then((res) => { console.log(res); setNewEmail(email); })
        .catch((err) => { console.log(err); onFail() });
      setEmailWarn("");
    } else {
      setEmailWarn(email);
      setNewEmail(userInfo.login_email);
    }

    setEmailSub(false);
  }

  // get user data from server, querying using userId recorded in the app's session
  useEffect(() => {
    const fetchUser = async () => {
      let fetchedData = null;
      if (props.uid == null) return;

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
    fetchUser();
  }, [props.uid, navigate]);

  return (
    <div className={"account-page"}>
      <TextBkgBox>
        <h1>Account</h1>
        <div className={"inline-flex"}>
          <h3>Username:</h3>
          <ToggleInput disabled={nameSub} saveInput={saveName} type="text"
            field="display_name" value={newName} setVal={setNewName} maxLength={20}
          />
        </div>
        { nameWarn !== "" ? <h4 className="warning">The display name "{nameWarn}" is taken.</h4> : null }
        <div className={"inline-flex"}>
          <h3>Email:</h3>
          <ToggleInput disabled={emailSub} saveInput={saveEmail} type="email"
            field="login_email" value={newEmail} setVal={setNewEmail}
          />
        </div>
        { emailWarn !== "" ? <h4 className="warning">The email "{emailWarn}" is taken.</h4> : null }
        <a href="/change-password">
          <TextButton disabled={nameSub || emailSub}>Change password</TextButton>
        </a>
      </TextBkgBox>
    </div>
  );
};

export default Account;
