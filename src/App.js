import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header, Footer } from './components';
import { Home, Login, Signup, Dashboard, AddItem, ItemDetails, ItemEdit, ItemHistory, Stats, Account, ChangePassword, ForgotPassword } from './pages';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Global.scss'
import  'react-multiple-select-dropdown-lite/dist/index.css'


function App() {
  
  // Get/Set login session
  const [loggedIn, setLoggedIn] = useState(true);
  const [uid, setUid] = useState();
  useEffect(() => {
    // TODO: SEE ABOVE, GET SESSION INFO FROM ELSEWHERE
    if (window.sessionStorage.getItem("loggedIn") === null)
      window.sessionStorage.setItem("loggedIn", true);
    
    setLoggedIn(window.sessionStorage.getItem("loggedIn"));
    setUid(
      window.sessionStorage.getItem("uid")
    );
  }, [])

  const loginHandler = (uid) => {
    // TODO: STORING IN SESSIONSTORAGE IS VERY UNSAFE, STORE SESSION INFO ELSEWHERE
    window.sessionStorage.setItem("loggedIn", true);
    setLoggedIn(true);

    window.sessionStorage.setItem("uid", uid);
    setUid(uid);
  }
  
  const logoutHandler = () => {
    // TODO: SEE ABOVE, MAKE SAFER
    window.sessionStorage.setItem("loggedIn", false);
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
            <Route path="/login" element={<Login loggedIn={true} onLogin={loginHandler} />} />
            <Route path="/dashboard" element={<Dashboard loggedIn={true} />} />
            <Route path="/add-item" element={<AddItem loggedIn={true} uid={uid} />} />
            <Route path="/item-details/:id" element={<ItemDetails loggedIn={true} uid={uid} />} />
            <Route path="/item-details/:id/edit" element={<ItemEdit loggedIn={true} uid={uid} />} />
            <Route path="/item-history/:id" element={<ItemHistory loggedIn={true} />} />
            <Route path="/stats" element={<Stats loggedIn={true} />} />
            <Route path="/signup" element={<Signup loggedIn={true} />} />
            <Route path="/forgot-password" element={<ForgotPassword loggedIn={true} />} />
            <Route path="/account" element={<Account uid={uid} />} />
            <Route path="/change-password" element={<ChangePassword uid={uid} loggedIn={true} />} />
          </Routes>
        </Router>
      </main>
      <Footer />
    </div>
  );
}

export default App;
