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


const Sidebar = ({ isOpen, toggleSidebar, labelSelected}) => {
    const three = 3
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
    let label1 = <div className="sidebar-item">
            <Link to="/budget">
            <RiMoneyDollarCircleLine className="sidebar-icon" />
                {isOpen && <span className="sidebar-text">Budget</span>}
            </Link>
        </div>
    let label2 = <div className="sidebar-item">
            <Link to="/investment">
                <FaChartLine className="sidebar-icon" />
                {isOpen && <span className="sidebar-text">Investments</span>}
            </Link>
        </div>
    let label3 = <div className="sidebar-item">
            <Link to="/planning">
            <LuNotebookPen className="sidebar-icon" />
                {isOpen && <span className="sidebar-text">Planning</span>}
            </Link>
        </div>
    let label4 = <div className="sidebar-item">
            <Link to="/recipe">
            <GiKnifeFork className="sidebar-icon" />
                {isOpen && <span className="sidebar-text">Meal Prep</span>}
            </Link>
        </div>
    if (labelSelected==1){
        label1 = <div className="selected-sidebar-item">
                <Link to="/budget">
                <RiMoneyDollarCircleLine className="sidebar-icon" />
                    {isOpen && <span className="sidebar-text">Budget</span>}
                </Link>
            </div>
    } else if(labelSelected==2){
        label2 = <div className="selected-sidebar-item">
            <Link to="/investment">
                <FaChartLine className="sidebar-icon" />
                {isOpen && <span className="sidebar-text">Investments</span>}
            </Link>
        </div>
    }else if(labelSelected==3){
        label3 = <div className="selected-sidebar-item">
            <Link to="/planning">
            <LuNotebookPen className="sidebar-icon" />
                {isOpen && <span className="sidebar-text">Planning</span>}
            </Link>
        </div>
    }else{
         label4 = <div className="selected-sidebar-item">
            <Link to="/recipe">
            <GiKnifeFork className="sidebar-icon" />
                {isOpen && <span className="sidebar-text">Meal Prep</span>}
            </Link>
        </div>
    }
    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-title">
                <button onClick={toggleSidebar} className="sidebar-toggle-btn">
                    {isOpen ? <FaArrowLeft /> : <GiHamburgerMenu />}
                </button>
            </div>
            <div className="sidebar-content">
                <div> {label1} </div>
                <div> {label2} </div>
                <div> {label3} </div>
                <div> {label4} </div>
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