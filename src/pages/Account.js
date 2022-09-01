import React, { useEffect, useState } from "react";
import '../styles/Account.scss'
import { TextBkgBox, ToggleInput, TextButton } from '../components';
import axios from "axios";

const Account = (props) => {
  const [userInfo, setUserInfo] = useState({});

  // get user data from server, querying using userId recorded in the app's loginSession
  useEffect(() => {
    const fetchUser = async () => {
      let fetchedData = null;
      await axios.get(
        `https://server-monkeys-backend-test.herokuapp.com/testingUser?id=${props.loginSession.userId}`
        )
        .then((res) => fetchedData = res.data)
        .catch((err) => console.log(err));

      if (fetchedData == null && props.loginSession) fetchedData = [{
        _id: props.loginSession.userId,
        display_name: "retrieval failed",
        login_email: "placeholder@mail.com",
        hashed_password: "thisisapassword",
      }];
      
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
          <ToggleInput
            type="text" initVal={userInfo.display_name}
            field="display_name" uid={userInfo._id}
          />
        </div>
        <div className={"inline-flex"}>
          <h3>Email:</h3>
          <ToggleInput
            type="email" initVal={userInfo.login_email}
            field="login_email" uid={userInfo._id}
          />
        </div>
        <a href="/change-password">
          <TextButton>Change password</TextButton>
        </a>
      </TextBkgBox>
    </div>
  );
};

export default Account;
