import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header, Footer } from './components';
import { Home, Login, Signup, Dashboard, AddItem, ItemDetails, ItemEdit, ItemHistory, Stats, Account, ChangePassword } from './pages';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Global.scss'
import  'react-multiple-select-dropdown-lite/dist/index.css'


function App() {
  
  // Get/Set login session
  const [loginSession, setLoginSession] = useState();
  useEffect(() => {
    // TODO: SEE ABOVE, GET SESSION INFO FROM ELSEWHERE
    setLoginSession(
      JSON.parse(window.sessionStorage.getItem("loginSession"))
    );
  }, [])

  const loginHandler = (session) => {
    // TODO: STORING IN SESSIONSTORAGE IS VERY UNSAFE, STORE SESSION INFO ELSEWHERE
    window.sessionStorage.setItem("loginSession", JSON.stringify(session));
    setLoginSession(session);
  }
  
  const logoutHandler = () => {
    // TODO: SEE ABOVE, MAKE SAFER
    window.sessionStorage.removeItem("loginSession"); 
    setLoginSession(null);
  }
  
  return (
    <div className="App">
      <Header loginSession={loginSession} onLogout={logoutHandler} />
      <main style={{minHeight: 'var(--main-height)'}}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={loginHandler} />} />
            <Route path="/dashboard/loaner" element={<Dashboard />} />
            <Route path="/dashboard/loanee" element={<Dashboard />} />
            <Route path="/add-item" element={<AddItem loginSession={loginSession} />} />
            <Route path="/item-details/:id" element={<ItemDetails loginSession={loginSession} />} />
            <Route path="/item-details/:id/edit" element={<ItemEdit loginSession={loginSession} />} />
            <Route path="/item-history/:id" element={<ItemHistory />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account loginSession={loginSession} />} />
            <Route path="/change-password" element={<ChangePassword loginSession={loginSession} />} />
          </Routes>
        </Router>
      </main>
      <Footer />
    </div>
  );
}

export default App;
