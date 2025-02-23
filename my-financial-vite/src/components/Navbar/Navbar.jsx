import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { Button } from '@mui/material';

const Navbar = () => {
    const navigate = useNavigate()
    const HomeButton = () =>{
        navigate("/")
    }
    return (
        <div className="navbar">
            <div className="container">
                <div className="left-side">
                    <Button className="title" variant="text" style={{color: "white"}} onClick={() => HomeButton()}>My Financial</Button>
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