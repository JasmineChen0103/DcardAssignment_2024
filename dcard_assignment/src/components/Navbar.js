import React from 'react';
import GitHubLogo from '../assets/github-logo.png';
import './Navbar.css';
import Login from '../pages/Login';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={GitHubLogo} alt="GitHub Logo" className="github-logo" />
            </div>
            <div className="navbar-right">
                <Login /> { }
            </div>
        </nav>
    );
};

export default Navbar;