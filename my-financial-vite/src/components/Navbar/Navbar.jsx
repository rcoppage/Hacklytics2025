import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
        <div className="container">
            <div className="left-side">
                <h1 className="title">My Financial</h1>
            </div>
            <div className="right-side">
                <Link to="/login">
                    <button className="login-btn">Login</button>
                </Link>
                <Link to="/signup">
                    <button className="signup-btn">Sign Up</button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Navbar