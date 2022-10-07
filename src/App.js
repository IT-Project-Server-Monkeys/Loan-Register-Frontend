import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header, Footer } from './components';
import { Home, Login, Signup, Dashboard, AddItem, ItemDetails, ItemEdit, ItemHistory, Stats, Account, ChangePassword, ForgotPassword } from './pages';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Global.scss'
import  'react-multiple-select-dropdown-lite/dist/index.css'


function App() {
  
  // Get/Set login session
  const [loggedIn, setLoggedIn] = useState(false);
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
    setUid(null);
  }

  
  return (
    <div className="App">
      <Header loggedIn={loggedIn} onLogout={logoutHandler} />
      <main style={{minHeight: 'var(--main-height)'}}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login loggedIn={loggedIn} onLogin={loginHandler} />} />
            <Route path="/dashboard" element={<Dashboard loggedIn={loggedIn} />} />
            <Route path="/add-item" element={<AddItem loggedIn={loggedIn} uid={uid} />} />
            <Route path="/item-details/:id" element={<ItemDetails loggedIn={loggedIn} uid={uid} />} />
            <Route path="/item-details/:id/edit" element={<ItemEdit loggedIn={loggedIn} uid={uid} />} />
            <Route path="/item-history/:id" element={<ItemHistory loggedIn={loggedIn} />} />
            <Route path="/stats" element={<Stats loggedIn={loggedIn} />} />
            <Route path="/signup" element={<Signup loggedIn={loggedIn} />} />
            <Route path="/forgot-password" element={<ForgotPassword loggedIn={loggedIn} />} />
            <Route path="/account" element={<Account uid={uid} loggedIn={loggedIn} />} />
            <Route path="/change-password" element={<ChangePassword uid={uid} loggedIn={loggedIn} />} />
          </Routes>
        </Router>
      </main>
      <Footer />
    </div>
  );
}

export default App;
