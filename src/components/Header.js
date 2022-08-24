import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import styles from "../styles/Header.module.scss"; // component scoped style
import logo from "../images/logo.svg";

const Header = (props) => {
  // check for mobile view
  const isMobile = useMediaQuery(
    { maxDeviceWidth: 375 }
 )

 // temporary login handler. generates random data,
 // then passes it onto parent via the onLogin provided by parent
 // TODO remove
  const handleLogin = () => {
    props.onLogin({ userId: 1234 });
  };

  // individual nav link component, consisting of button with href
  const NavLink = (navProps) => {

    // set active style when current page is on link
    const [linkStyle, setLinkStyle] = useState(null);
    useEffect(() => {
      let curPath = window.location.pathname.split("/")[1];
      if (curPath && navProps.href.includes(curPath)) {
        setLinkStyle({backgroundColor: "var(--blue-color)", color: "white"});
      }
    }, [navProps])

    return (
      <a href={navProps.href}>
        <button style={linkStyle} className={`${styles.navlink}`} onClick={navProps.onClick}>{navProps.children}</button>
      </a>
    );
  }

  // nav component, showing different navlinks depending on login session
  const Nav = () => {

    // mobile view, show dropdown menu of navlinks or login navlink
    if (isMobile) {
      if (props.loginSession != null) return (
        <div className={`${styles.nav}`}>
          <button className={`${styles.navlink}`}>=</button>
          <div className={`${styles.dropdown}`}>
            <NavLink href="/dashboard/loaner">Dashboard</NavLink>
            <NavLink href="/account">Account</NavLink>
            <NavLink href="/" onClick={props.onLogout}>Log Out</NavLink>
          </div>
        </div>
      );
      else return (
        <div className={`${styles.nav}`}>
          {/* note temporary login handler, TODO remove */}
          <NavLink href="/login" onClick={handleLogin}>Log In</NavLink>
        </div>
      );
    }

    // desktop view, show applicable navlinks
    else {
      if (props.loginSession != null) return (
        <div className={`${styles.nav}`}>
          <NavLink href="/dashboard/loaner">Dashboard</NavLink>
          <NavLink href="/account">Account</NavLink>
          <NavLink href="/" onClick={props.onLogout}>Log Out</NavLink>
        </div>
      );
      else return (
        <div className={`${styles.nav}`}>
          {/* note temporary login handler, TODO remove */}
          <NavLink href="/login" onClick={handleLogin}>Log In</NavLink>
        </div>
      );
    }
  };

  // return Header component, consisting of clickable logo + nav
  return (
    <div className={`${styles.header}`}>
      <a href="/" style={{margin: "0.75rem 0 0.75rem 0"}}>
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

