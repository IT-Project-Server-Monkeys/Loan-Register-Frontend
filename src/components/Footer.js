import React from "react";
import styles from "../styles/Footer.module.scss"; // component scoped style

const Footer = () => {
  return (
    <div className={`${styles.footer}`}>
      Loan Register © Server Monkeys, 2022
    </div>
  );
};

export default Footer;
