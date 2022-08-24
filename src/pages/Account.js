import React, { useEffect, useState } from 'react';
import axios from "axios";

const Account = () => {
  const [userInfo, setUserInfo] = useState("aaaa");

  // basic get request. TODO move to helper functions?
  const fetchUser = async () => {
    await axios.get("http://webcode.me")
    // await axios.get("https://server-monkeys-backend-test.herokuapp.com/users", {params: {_id: "62fd8a9df04410afbc6df31f"}})
      .then((res) => {setUserInfo(res.data);})
      .catch((err) => {setUserInfo(JSON.stringify(err));})
  }

  useEffect(() => {
    fetchUser();
    console.log("fetch");
  }, []);


  return <div>{userInfo}</div>;
};

export default Account;