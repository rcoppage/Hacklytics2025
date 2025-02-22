import React from 'react';
import './Home.css';

import Navbar from '../Navbar/Navbar';

function Home() {
    return (
        <div className="home">
            <Navbar />
            <div className="container">
                <h1>My Financial</h1>
                <p>Manage your finances with ease.</p>
            </div>
        </div>
    )
}

export default Home;