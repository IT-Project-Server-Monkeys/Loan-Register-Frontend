import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Header, Footer } from './components';
import { Home, Login, Signup, LoaneeDashboard, LoanerDashboard, AddItem, ItemDetails, ItemHistory, Stats } from './pages';

import './styles/Global.scss'

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/loaner" element={<LoanerDashboard />} />
          <Route path="/dashboard/loanee" element={<LoaneeDashboard />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/item-details" element={<ItemDetails />} />
          <Route path="/item-history" element={<ItemHistory />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
