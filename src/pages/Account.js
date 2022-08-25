import React, { useEffect, useState } from "react";
import '../styles/Account.scss'
import { TextBkgBox, ToggleInput } from '../components';
import axios from "axios";

const Account = () => {
  const [userInfo, setUserInfo] = useState("aaaa");

  // basic get request. TODO move to helper functions?
  const fetchUser = async () => {
    let fetchedData;

    await axios.get("https://server-monkeys-backend-test.herokuapp.com/users/62fd8a9df04410afbc6df31f")
    // await axios.get("http://webcode.me")
      .then((res) => {fetchedData = res.data;})
      .catch((err) => {console.log(err);})
    
    fetchedData = [
      { // TODO FIX AXIOS
        _id: "62fd8a9df04410afbc6df31f",
        display_name: "Test User 3",
        login_email: "test_user3@gmail.com",
        hashed_password: "thisisapassword",
      },
    ];
    setUserInfo(fetchedData[0]);
  };

  useEffect(() => {
    fetchUser();
    console.log("fetch");
  }, []);

  return (
    <div className={"account-page"}>
      <TextBkgBox>
        <h1>Account</h1>
        <div className={"inline-flex"}>
          <h3>Display name:</h3>
          <ToggleInput field="display_name" initVal={userInfo.display_name} />
        </div>
        <div className={"inline-flex"}>
          <h3>Email:</h3>
          <ToggleInput field="login_email" initVal={userInfo.login_email} />
        </div>
        <a href="/signup">
          <button>Change password</button>
        </a>
      </TextBkgBox>
    </div>
  );
};

export default Account;
