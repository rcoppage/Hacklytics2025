import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import Navbar from '../Navbar/Navbar';
import homeBack from '../../images/home-side-image.png';

function Home() {
    return (
        <div className="home">
            <Navbar />
            <div className="home-container">
                <div className="left-container">
                    <h1>Budgetly</h1>
                    <p>Budgetly is your all-in-one budgeting companion, helping you take control of your finances with ease. It helps you track your spending weekly, from groceries and recipes to saving for big purchases. With Budgetly, you can plan your finances to achieve your goals and enjoy financial freedom. Our smart tools automatically suggest the best way to allocate your money each month, making budgeting easier than ever.</p>
                    <Link to="/register">
                        <button className="try-btn">Try Now!</button>
                    </Link>
                </div>
                <div className="right-container">
                    <img src={homeBack} alt="Home Background" />
                </div>
            </div>
        </div>
    )
}

export default Home;