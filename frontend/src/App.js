import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Purchases from './pages/Purchases';
import Issuances from './pages/Issuances';
import Stocks from './pages/Stocks';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/issuances" element={<Issuances />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 