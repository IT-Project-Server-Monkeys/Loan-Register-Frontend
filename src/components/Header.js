import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import styles from "../styles/Header.module.scss"; // component scoped style
import logo from "../images/logo.svg";

const Header = (props) => {
  const isMobile = useMediaQuery(
    { maxDeviceWidth: 375 }
 )

  const handleLogin = () => {
    props.onLogin({ userId: 1234 });
  };

  const NavLink = (navProps) => {
    const [linkStyle, setLinkStyle] = useState(null);

    useEffect(() => {
      let curPath = window.location.pathname.split("/")[1];
      if (curPath && navProps.href.includes(curPath)) {
        setLinkStyle({backgroundColor: "var(--blue-color)", color: "white"});
      }
    }, [navProps])

    return (
      <a href={navProps.href}>
        <button style={linkStyle} className={`${styles.button}`} onClick={navProps.onClick}>{navProps.children}</button>
      </a>
    );
  }
  
  const navDropdown = () => {
    console.log("show dropdown contents");
  }

  const Nav = () => {
    if (isMobile) {
      if (props.loginSession != null) {
        return (
          <div className={`${styles.nav}`}>
            <button className={`${styles.button}`} onHover={navDropdown}>=</button>
            <div className={`${styles.dropdown}`}>
              <NavLink href="/dashboard/loaner">Dashboard</NavLink>
              <NavLink href="/account">Account</NavLink>
              <NavLink href="/" onClick={props.onLogout}>Log Out</NavLink>
            </div>
          </div>
        );
      } else {
        return (
          <div className={`${styles.nav}`}>
            <NavLink href="/login" onClick={handleLogin}>Log In</NavLink>
          </div>
        );
      }
    }

    else { // desktop view
      if (props.loginSession != null) {
        return (
          <div className={`${styles.nav}`}>
            <NavLink href="/dashboard/loaner">Dashboard</NavLink>
            <NavLink href="/account">Account</NavLink>
            <NavLink href="/" onClick={props.onLogout}>Log Out</NavLink>
          </div>
        );
      } else {
        return (
          <div className={`${styles.nav}`}>
            <NavLink href="/login" onClick={handleLogin}>Log In</NavLink>
          </div>
        );
      }
    }
  };

  return (
    <div className={`${styles.header}`}>
      <a href="/" style={{margin: "0.5rem 0 0.5rem 0"}}>
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

