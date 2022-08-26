import React, { useEffect, useState } from "react";
import '../styles/Account.scss'
import { TextBkgBox, ToggleInput, TextButton } from '../components';
// import axios from "axios";

const Account = (props) => {
  const [userInfo, setUserInfo] = useState({});

  // get user data from server, querying using userId recorded in the app's loginSession
  useEffect(() => {
    const fetchUser = async () => {
      let fetchedData = null;
      // await axios.get(
      //   `https://server-monkeys-backend-test.herokuapp.com/users/${props.loginSession.userId}`
      //   )
      // await axios.get("http://www.columbia.edu/~fdc/sample.html")
      // await axios.get("http://webcode.me") // TODO make axios get from https sites
      //   .then((res) => {fetchedData = res.data; console.log(res.data)})
      //   .catch((err) => {console.log(err);});

      if (fetchedData == null && props.loginSession) fetchedData = [{
        _id: props.loginSession.userId,
        display_name: "retrieval failed",
        login_email: "placeholder@mail.com",
        hashed_password: "thisisapassword",
      }]; else console.log(fetchedData);
      
      setUserInfo(fetchedData[0]);
    };
    fetchUser();
  }, [props.loginSession]);

  return (
    <div className={"account-page"}>
      <TextBkgBox>
        <h1>Account</h1>
        <div className={"inline-flex"}>
          <h3>Display name:</h3>
          <ToggleInput type="text" field="display_name" initVal={userInfo.display_name} />
        </div>
        <div className={"inline-flex"}>
          <h3>Email:</h3>
          <ToggleInput type="email" field="login_email" initVal={userInfo.login_email} />
        </div>
        <a href="/change-password">
          <TextButton>Change password</TextButton>
        </a>
      </TextBkgBox>
    </div>
  );
};

export default Account;
