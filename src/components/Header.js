import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "../styles/Header.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../images/logo.svg";

const Header = (props) => {
  // check for mobile view
  const isMobile = useMediaQuery({ maxDeviceWidth: 576 });

  // individual nav link component, consisting of button with href
  const NavLink = (navProps) => {

    // set component inline style to linkStyle (default value null)
    // upon first render, if link page is current page, set linkStyle to active style 
    const [linkStyle, setLinkStyle] = useState(null);
    useEffect(() => {
      let curPath = window.location.pathname.split("/")[1];
      if (curPath && navProps.href.includes(curPath)) {
        setLinkStyle({backgroundColor: "var(--blue-color)", color: "white"});
      }
    }, [navProps])

    return (
      <a href={navProps.href}>
        <button style={linkStyle} className="navlink" onClick={navProps.onClick}>{navProps.children}</button>
      </a>
    );
  }

  // nav component, showing different navlinks depending on login session
  const Nav = () => {

    // mobile view, show dropdown menu of navlinks or login navlink
    if (isMobile) {
      if (props.session != null) return (
        <nav>
          <button className="navlink">
              <GiHamburgerMenu size={20} />
          </button>
          <div className="dropdown">
            <NavLink href="/dashboard/loaner">Dashboard</NavLink>
            <NavLink href="/account">Account</NavLink>
            <NavLink href="/" onClick={props.onLogout}>Log Out</NavLink>
          </div>
        </nav>
      );
      else return (
        <nav>
          <NavLink href="/login">Log In</NavLink>
        </nav>
      );
    }

    // desktop view, show applicable navlinks
    else {
      if (props.session != null) return (
        <nav>
          <NavLink href="/dashboard/loaner">Dashboard</NavLink>
          <NavLink href="/account">Account</NavLink>
          <NavLink href="/" onClick={props.onLogout}>Log Out</NavLink>
        </nav>
      );
      else return (
        <nav>
          <NavLink href="/login">Log In</NavLink>
        </nav>
      );
    }
  };

  // return Header component, consisting of clickable logo + nav
  return (
    <header className={"top-header"}>
      <a href="/" style={{margin: "0.75rem 0 0.75rem 0"}}>
        <img
          className="logo"
          src={logo}
          alt="Loan Register logo"
        ></img>
      </a>
      <Nav />
    </header>
  );
};

export default Header;

