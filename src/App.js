import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Footer } from './components';
import { Home, Login, Signup, Dashboard, AddItem, ItemDetails, ItemEdit, ItemHistory, Stats, Account, ChangePassword, ForgotPassword } from './pages';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Global.scss'
import  'react-multiple-select-dropdown-lite/dist/index.css'


function App() {
  
  // Get/Set login session
  const [loggedIn, setLoggedIn] = useState();
  const [uid, setUid] = useState();
  useEffect(() => {
    // TODO: SEE ABOVE, GET SESSION INFO FROM ELSEWHERE
    setLoggedIn(
      window.sessionStorage.getItem("loggedIn") === "true" ? true : false
    );
    setUid(window.sessionStorage.getItem("uid"));
  }, [])

  const loginHandler = (uid) => {
    // TODO: STORING IN SESSIONSTORAGE IS VERY UNSAFE, STORE SESSION INFO ELSEWHERE
    window.sessionStorage.setItem("loggedIn", true);
    window.sessionStorage.setItem("uid", uid);
  }
  
  const logoutHandler = () => {
    // TODO: SEE ABOVE, MAKE SAFER
    window.sessionStorage.removeItem("loggedIn");
    window.sessionStorage.removeItem("uid"); 
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
            <Route path="/dashboard" element={<Dashboard loggedIn={loggedIn} onLogout={logoutHandler} />} />
            <Route path="/add-item" element={<AddItem loggedIn={loggedIn} uid={uid} onLogout={logoutHandler} />} />
            <Route path="/item-details/:id" >
              <Route path="" element={<ItemDetails loggedIn={loggedIn} uid={uid} onLogout={logoutHandler} />} />
              <Route path="edit" element={<ItemEdit loggedIn={loggedIn} uid={uid} onLogout={logoutHandler} />} />
              <Route path="history" element={<ItemHistory loggedIn={loggedIn} onLogout={logoutHandler} />} />
            </Route>
            <Route path="/stats" element={<Stats uid={uid} loggedIn={loggedIn} onLogout={logoutHandler} />} />
            <Route path="/signup" element={<Signup loggedIn={loggedIn} onLogout={logoutHandler} />} />
            <Route path="/forgot-password" element={<ForgotPassword loggedIn={loggedIn} onLogout={logoutHandler} />} />
            <Route path="/account" element={<Account uid={uid} loggedIn={loggedIn} onLogout={logoutHandler} />} />
            <Route path="/change-password" element={<ChangePassword uid={uid} loggedIn={loggedIn} onLogout={logoutHandler} />} />
          </Routes>
        </Router>
      </main>
      <Footer />
    </div>
  );
}

export default App;
