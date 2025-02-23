import React from 'react';
import './Sidebar.css';
import { FaHome, FaChartLine, FaArrowLeft } from 'react-icons/fa';
import { GiHamburgerMenu, GiKnifeFork } from 'react-icons/gi';
import { LuNotebookPen } from "react-icons/lu";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
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
        </div>
    </div>
  )
}

export default Sidebar