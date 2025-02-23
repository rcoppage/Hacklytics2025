import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home/Home';
import Budget from './components/Budget/Budget';
import Investment from './components/Investment/Investment';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Planning from './components/Planning/Planning';
import RegisterForm from './components/RegisterForm/RegisterForm';
import GenAI from './components/GenAI/GenAI';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/planning" element={<Planning />} />
        <Route path="/registerform" element={<RegisterForm />}/>
        <Route path="/recipe" element={<GenAI />}/>
      </Routes>
    </div>
  )
}

export default App;