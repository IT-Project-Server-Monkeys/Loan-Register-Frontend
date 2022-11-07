import React, { useLayoutEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "../styles/Header.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../images/logo.svg";
import { Link, useLocation } from "react-router-dom";

const Header = (props) => {
  // check for mobile view
  const isMobile = useMediaQuery({ maxDeviceWidth: 576 });
  const logOut = () => {
    if (props.onLogout == null) return;
    props.onLogout();
  }

  // individual nav link component, consisting of button with href
  const NavLink = (navProps) => {
    const location = useLocation();
    const [isHovering, setIsHovering] = useState(false);

    // set component inline style to linkStyle (default value null)
    // upon first render, if link page is current page, set linkStyle to active style 
    const [linkStyle, setLinkStyle] = useState(null);
    useLayoutEffect(() => {
      if (location.pathname && navProps.href === location.pathname) {
        setLinkStyle({backgroundColor: "var(--blue-color)", color: "white"});
      }
    }, [navProps, location.pathname]);

    return (
      <Link to={navProps.href}>
        <button style={linkStyle} className={`navlink ${isHovering ? "hover" : ""}`} onClick={navProps.onClick}
          onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}
        >
          {navProps.children}
        </button>
      </Link>
    );
  }

  // nav component, showing different navlinks depending on login session
  const Nav = () => {

    const [isHovering, setIsHovering] = useState(false);

    // mobile view, show dropdown menu of navlinks or login navlink
    if (isMobile) {
      if (props.loggedIn === true) return (
        <nav>
          <button className={`navlink ${isHovering ? "hover" : ""}`}
            onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}
          >
              <GiHamburgerMenu size={20} />
          </button>
          <div className={`dropdown ${isHovering ? "hover-dp" : ""}`}>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/account">Account</NavLink>
            <NavLink href="/" onClick={logOut}>Log Out</NavLink>
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
      if (props.loggedIn === true) return (
        <nav>
          <NavLink href="/dashboard">Dashboard</NavLink>
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
      <a href={props.loggedIn ? "/dashboard" : "/"} style={{margin: "0.75rem 0 0.75rem 0"}}>
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

export default React.memo(Header);

