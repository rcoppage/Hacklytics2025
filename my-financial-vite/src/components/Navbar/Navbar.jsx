import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate()
    const HomeButton = () =>{
        navigate("/")
    }
    return (
        <div className="navbar">
            <div className="container">
                <div className="left-side">
                    <button className="title" onClick={() => HomeButton()}>Budgetly</button>
                </div>
                <div className="right-side">
                    <Link to="/login">
                        <button className="login-btn">Login</button>
                    </Link>
                    <Link to="/register">
                        <button className="signup-btn">Register</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar