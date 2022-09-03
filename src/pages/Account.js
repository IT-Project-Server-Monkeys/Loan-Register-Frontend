import React, { useEffect, useState } from "react";
import '../styles/Account.scss'
import { TextBkgBox, ToggleInput, TextButton, Loading } from '../components';
import axios from "axios";

const Account = (props) => {
  const [userInfo, setUserInfo] = useState({
    display_name: <Loading />,
    login_email: <Loading />,
  });

  const saveInput = async (input) => {
    let formData = { _id: props.loginSession.userId, ...input};
    console.log(formData);
    await axios({
      method: "put", data: formData,
      url: "https://server-monkeys-backend-test.herokuapp.com/testingUser",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  // get user data from server, querying using userId recorded in the app's loginSession
  useEffect(() => {
    const fetchUser = async () => {
      let fetchedData = null;
      if (props.loginSession == null) return;
      await axios.get(
        `https://server-monkeys-backend-test.herokuapp.com/testingUser?id=${props.loginSession.userId}`
        )
        .then((res) => fetchedData = res.data)
        .catch((err) => console.log(err));

      if (fetchedData == null) fetchedData = [{
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
          <ToggleInput saveInput={saveInput} type="text"
            field="display_name" initVal={userInfo.display_name}
          />
        </div>
        <div className={"inline-flex"}>
          <h3>Email:</h3>
          <ToggleInput saveInput={saveInput} type="email"
            field="login_email" initVal={userInfo.login_email}
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
