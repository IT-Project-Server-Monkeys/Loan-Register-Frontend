import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header, Footer } from './components';
import { Home, Login, Signup, LoaneeDashboard, LoanerDashboard, AddItem, ItemDetails, ItemHistory, Stats, Account } from './pages';

import './styles/Global.scss'

function App() {
  
  // TODO: get login session from login
  const [loginSession, setLoginSession] = useState();
  const loginHandler = (session) => {
    setLoginSession(session);
    window.sessionStorage.setItem("loginSession", session);
    console.log("user has logged in");
  }
  const logoutHandler = () => {
    setLoginSession(null);
    window.sessionStorage.removeItem("loginSession");
    console.log("user has logged out");
  }

  useEffect(() => {
    setLoginSession(window.sessionStorage.getItem("loginSession"));
  })

  return (
    <div className="App">
      <Header loginSession={loginSession} onLogout={logoutHandler}/* onLogin={loginHandler}*/ />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} onLogin={loginHandler} />
          <Route path="/dashboard/loaner" element={<LoanerDashboard />} />
          <Route path="/dashboard/loanee" element={<LoaneeDashboard />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/item-details" element={<ItemDetails />} />
          <Route path="/item-history" element={<ItemHistory />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
