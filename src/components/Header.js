import React from "react";
import styles from "../styles/Header.module.scss"; // component scoped style
import logo from '../images/logo.svg';

const Header = (props) => {

  // TODO
  const logOut = () => {
    console.log("logged out");
  }

  const Nav = (navProps) => {
    if (navProps.loggedIn) {
      return (
        <div>
          <button>
            <a href="/dashboard/loaner">Dashboard</a>
          </button>
          <button>
            <a href="/account">Account</a>
          </button>
          <button onClick={logOut}>Log Out</button>
        </div>
      );
    } else {
      return (
        <button>
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
      <Nav loggedIn={props.loginSession != null} />
    </div>
  );
};

export default Header;

