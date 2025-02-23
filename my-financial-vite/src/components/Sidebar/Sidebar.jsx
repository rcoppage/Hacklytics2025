import React from 'react';
import './Sidebar.css';
import { FaHome, FaChartLine, FaArrowLeft } from 'react-icons/fa';
import { GiHamburgerMenu, GiKnifeFork, GiExitDoor } from 'react-icons/gi';
import { LuNotebookPen } from "react-icons/lu";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { auth } from "../../../common/firebase";
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';


const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [signOut] = useSignOut(auth);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const handleLogout = async() => {
        const success = await signOut()
        if (success) {
            alert("You have been logged out")
            navigate("/")
        }
    };
    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-title">
                <button onClick={toggleSidebar} className="sidebar-toggle-btn">
                    {isOpen ? <FaArrowLeft /> : <GiHamburgerMenu />}
                </button>
            </div>
            <div className="sidebar-content">
                <div className="sidebar-item">
                    <Link to="/budget">
                    <RiMoneyDollarCircleLine className="sidebar-icon" />
                        {isOpen && <span className="sidebar-text">Budget</span>}
                    </Link>
                </div>
                <div className="sidebar-item">
                    <Link to="/investment">
                        <FaChartLine className="sidebar-icon" />
                        {isOpen && <span className="sidebar-text">Investments</span>}
                    </Link>
                </div>
                <div className="sidebar-item">
                    <Link to="/planning">
                    <LuNotebookPen className="sidebar-icon" />
                        {isOpen && <span className="sidebar-text">Planning</span>}
                    </Link>
                </div>
                <div className="sidebar-item">
                    <Link to="/recipe">
                    <GiKnifeFork className="sidebar-icon" />
                        {isOpen && <span className="sidebar-text">Meal Prep</span>}
                    </Link>
                </div>
                <div className="signOut">
                    <button onClick={handleLogout}>
                        <GiExitDoor className="sidebar-icon" />
                            {isOpen && <span className="sidebar-text">Sign Out</span>}
                    </button>

                </div>
            </div>
        </div>
  )
}

export default Sidebar