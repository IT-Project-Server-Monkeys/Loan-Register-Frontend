import React from "react";
import styles from "../styles/Header.module.scss"; // component scoped style
import logo from '../images/logo.svg';

const Header = (props) => {

  const handleLogin = () => {
    props.onLogin({userId: 1234});
  }

  const Nav = () => {
    if (props.loginSession != null) {
      return (
        <div>
          <button>
            <a href="/dashboard/loaner">Dashboard</a>
          </button>
          <button>
            <a href="/account">Account</a>
          </button>
          <button onClick={props.onLogout}>Log Out</button>
        </div>
      );
    } else {
      return (
        <button onClick={handleLogin}>
          <a href="/login">Log In</a>
        </button>
      );
    }
  };

  return (
    <div className={`${styles.header}`}>
      <a href="/">
        <img src={logo} alt="Loan Register logo"></img>
      </a>
      <Nav />
    </div>
  );
};

export default Header;

