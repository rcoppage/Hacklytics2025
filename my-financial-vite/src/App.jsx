import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home/Home';
import Budget from './components/Budget/Budget';
import Investment from './components/Investment/Investment';
import Retirement from './components/Retirement/Retirement';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Planning from './components/Planning/Planning';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/retirement" element={<Retirement />} />
      </Routes>
    </div>
  )
}

export default App;