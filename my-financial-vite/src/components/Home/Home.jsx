import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import Navbar from '../Navbar/Navbar';
import homeBack from '../../images/home-backdrop.jpeg';

function Home() {
    return (
        <div className="home">
            <Navbar />
            <div className="image-container">
                <img src={homeBack} alt="Home Background" />
            </div>
            <div className="container">
                <h1>My Financial</h1>
                <p>Welcome to My Financial, where you can easily budget your money and save for the future!  We offer various ways for you to create a better spending plan, including retirement calculations, advanced algorithms to ensure you invest in the best stocks, and more!</p>
                <Link to="/register">
                    <button className="try-btn">Try Now!</button>
                </Link>
            </div>
        </div>
    )
}

export default Home;