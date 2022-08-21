import React from "react";
import styles from "../styles/Header.module.scss"; // component scoped style
import logo from "../images/logo.svg";

const Header = (props) => {
  const handleLogin = () => {
    props.onLogin({ userId: 1234 });
  };

  const Nav = () => {
    if (props.loginSession != null) {
      return (
        <div className={`${styles.nav}`}>
          <button className={`${styles.button}`}>
            <a href="/dashboard/loaner" className={`${styles.a}`}>Dashboard</a>
          </button>
          <button className={`${styles.button}`}>
            <a href="/account" className={`${styles.a}`}>Account</a>
          </button>
          <button className={`${styles.button}`} onClick={props.onLogout}>Log Out</button>
        </div>
      );
    } else {
      return (
        <div className={`${styles.nav}`}>
          <button onClick={handleLogin} className={`${styles.button}`} >
            <a href="/login" className={`${styles.a}`}>Log In</a>
          </button>
        </div>
      );
    }
  };

  return (
    <div className={`${styles.header}`}>
      <a href="/" style={{height: "fit-content"}}>
        <img
          className={`${styles.logo}`}
          src={logo}
          alt="Loan Register logo"
        ></img>
      </a>
      <Nav />
    </div>
  );
};

export default Header;

