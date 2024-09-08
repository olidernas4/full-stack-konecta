import React from 'react';
import './Navbar.css';

const Navbar = ({ handleLogout }) => (
    <div className="navbar">
        <h1 className="navbar-title">Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
);

export default Navbar;