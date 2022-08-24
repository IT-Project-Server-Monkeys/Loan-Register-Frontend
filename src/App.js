import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header, Footer } from './components';
import { Home, Login, Signup, LoaneeDashboard, LoanerDashboard, AddItem, ItemDetails, ItemHistory, Stats, Account } from './pages';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Global.scss'


function App() {
  
  // Get/Set login session
  const [loginSession, setLoginSession] = useState();
  const loginHandler = (session) => {

    // TODO: STORING IN SESSIONSTORAGE IS VERY UNSAFE, STORE SESSION INFO ELSEWHERE
    window.sessionStorage.setItem("loginSession", session);

    setLoginSession(session);
    console.log("user has logged in");
  }
  const logoutHandler = () => {

    // TODO: SEE ABOVE, MAKE SAFER
    window.sessionStorage.removeItem("loginSession"); 

    setLoginSession(null);
    console.log("user has logged out");
  }
  useEffect(() => {
    // TODO: SEE ABOVE, GET SESSION INFO FROM ELSEWHERE
    setLoginSession(window.sessionStorage.getItem("loginSession"));
  }, [])

  return (
    <div className="App">
      <Header loginSession={loginSession} onLogout={logoutHandler} onLogin={loginHandler} />
      <main style={{minHeight: '95vh'}}>
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
      </main>
      <Footer />
    </div>
  );
}

export default App;
