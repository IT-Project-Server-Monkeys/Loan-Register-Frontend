import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header, Footer } from './components';
import { Home, Login, Signup, Dashboard, AddItem, ItemDetails, ItemEdit, ItemHistory, Stats, Account, ChangePassword } from './pages';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Global.scss'
import  'react-multiple-select-dropdown-lite/dist/index.css'


function App() {
  
  // Get/Set login session
  const [uid, setUid] = useState();
  useEffect(() => {
    // TODO: SEE ABOVE, GET SESSION INFO FROM ELSEWHERE
    setUid(
      window.sessionStorage.getItem("uid")
    );
  }, [])

  const loginHandler = (uid) => {
    // TODO: STORING IN SESSIONSTORAGE IS VERY UNSAFE, STORE SESSION INFO ELSEWHERE
    window.sessionStorage.setItem("uid", uid);
    setUid(uid);
  }
  
  const logoutHandler = () => {
    // TODO: SEE ABOVE, MAKE SAFER
    window.sessionStorage.removeItem("uid"); 
    setUid(null);
  }
  
  return (
    <div className="App">
      <Header uid={uid} onLogout={logoutHandler} />
      <main style={{minHeight: 'var(--main-height)'}}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={loginHandler} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-item" element={<AddItem uid={uid} />} />
            <Route path="/item-details/:id" element={<ItemDetails uid={uid} />} />
            <Route path="/item-details/:id/edit" element={<ItemEdit uid={uid} />} />
            <Route path="/item-history/:id" element={<ItemHistory />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account uid={uid} />} />
            <Route path="/change-password" element={<ChangePassword uid={uid} />} />
          </Routes>
        </Router>
      </main>
      <Footer />
    </div>
  );
}

export default App;
