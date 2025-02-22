import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home/Home';
import Budget from './components/Budget/Budget';
import Investment from './components/Investment/Investment';
import Retirement from './components/Retirement/Retirement';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

function App() {
  return (
    <div>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/budget">Budget</Link>
        <Link to="/investment">Investment</Link>
        <Link to="/retirement">Retirement</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/retirement" element={<Retirement />} />
      </Routes>
    </div>
  )
}

export default App;