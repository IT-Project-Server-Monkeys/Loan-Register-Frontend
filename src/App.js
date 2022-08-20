import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header, Footer } from './components';
import { Home, Login, Signup, LoaneeDashboard, LoanerDashboard, AddItem, ItemDetails, ItemHistory, Stats, Account } from './pages';

import './styles/Global.scss'

function App() {
  // TODO: get login session & pass to components
  return (
    <div className="App">
      <Header loginSession={true} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/loaner" element={<LoanerDashboard />} />
          <Route path="/dashboard/loanee" element={<LoaneeDashboard />} />
          <Route path="/addItem" element={<AddItem />} />
          <Route path="/itemDetails" element={<ItemDetails />} />
          <Route path="/itemHistory" element={<ItemHistory />} />
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
