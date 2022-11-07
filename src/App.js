import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import jwt_decode from "jwt-decode";

import { Footer } from './components';
import { Home, Login, Signup, Dashboard, AddItem, ItemDetails, ItemEdit, ItemHistory, Stats, Account, ChangePassword, ForgotPassword, NotFound } from './pages';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Global.scss'
import  'react-multiple-select-dropdown-lite/dist/index.css'


function App() {
  
  // Get/Set login session
  const [loggedIn, setLoggedIn] = useState();
  const [uid, setUid] = useState(null);


  useEffect(() => {

    const token = window.sessionStorage.getItem("accessToken")
    if (token !== null) {
      const decoded = jwt_decode(token)
      setUid(decoded.user)
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
      setUid(null);
    }
    
  }, [])

  // no longer need this function
  const loginHandler = (uid) => {
    // window.sessionStorage.setItem("loggedIn", true);
    // setLoggedIn(true);
    // setUid(uid);
  }
  
  const logoutHandler = () => {
    window.sessionStorage.removeItem("accessToken"); 
    window.sessionStorage.removeItem("refreshToken"); 
    setLoggedIn(false);
    setUid(null);
  }

  
  return (
    <div className="App">
      <main>
        <Router>
          <Routes>
            <Route path="/" element={<Home onLogout={logoutHandler} />} />
            <Route path="/login" element={<Login loggedIn={loggedIn} onLogin={loginHandler} />} />
            <Route path="/dashboard" element={<Dashboard loggedIn={loggedIn} uid={uid} onLogout={logoutHandler} />} />
            <Route path="/add-item" element={<AddItem loggedIn={loggedIn} uid={uid} onLogout={logoutHandler} />} />
            <Route path="/item-details/:id" >
              <Route path="" element={<ItemDetails loggedIn={loggedIn} uid={uid} onLogout={logoutHandler} />} />
              <Route path="edit" element={<ItemEdit loggedIn={loggedIn} uid={uid} onLogout={logoutHandler} />} />
              <Route path="history" element={<ItemHistory loggedIn={loggedIn} uid={uid} onLogout={logoutHandler} />} />
            </Route>
            <Route path="/stats" element={<Stats uid={uid} loggedIn={loggedIn} onLogout={logoutHandler} />} />
            <Route path="/signup" element={<Signup loggedIn={loggedIn} onLogout={logoutHandler} />} />
            <Route path="/forgot-password" element={<ForgotPassword loggedIn={loggedIn} onLogout={logoutHandler} />} />
            <Route path="/account" element={<Account uid={uid} loggedIn={loggedIn} onLogout={logoutHandler} />} />
            <Route path="/change-password" element={<ChangePassword uid={uid} loggedIn={loggedIn} onLogout={logoutHandler} />} />
            <Route path="*" element={<NotFound loggedIn={loggedIn} onLogout={logoutHandler} />} />
          </Routes>
        </Router>
      </main>
      <Footer />
    </div>
  );
}

export default App;
