import React, { useEffect, useState } from "react";
import '../styles/Account.scss'
import { TextBkgBox, ToggleInput, TextButton, Loading } from '../components';
import API from '../utils/api';
import { useNavigate } from "react-router-dom";

const Account = (props) => {
  const redirect = useNavigate();
  const [userInfo, setUserInfo] = useState({
    display_name: <Loading />,
    login_email: <Loading />,
  });

  const saveInput = async (input) => {
    let formData = { _id: props.uid, ...input};
    console.log(formData);
    await API(`/users`, {
      method: "put", data: formData,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
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
        display_name: "retrieval failed",
        login_email: "placeholder@mail.com",
        hashed_password: "thisisapassword",
      }];
      
      setUserInfo(fetchedData);
    };
    fetchUser();
  }, [props.uid, redirect]);

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
