import React from 'react';
import styles from "../styles/Login.module.scss";

const Login = () => {
  return (
    <div className={`${styles.background}`}>
      <div className={`${styles.box}`}>
        <div className={`${styles.h1}`}>
          Log in to LR!
        </div>
        <div className={`${styles["inline-flex"]}`}>
          <div className={`${styles.h3}`}>
            Username:
          </div>
          <input type="text" placeholder="Enter username" className={`${styles["input-box"]}`}/>
        </div>
        <div className={`${styles["inline-flex"]}`}>
          <div className={`${styles.h3}`}>
              Password:
          </div>
          <input type="text" placeholder="Enter password" className={`${styles["input-box"]}`}/>
        </div>
        <a href="" className={`${styles.a}`}>Forgot password?</a>
        <a href="/signup" className={`${styles.a}`}>New user?</a>
        <button onClick="" className={`${styles.button}`}>Login</button>
      </div>
    </div>
  );
};

export default Login;
