//App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CallbackPage from './pages/CallbackPage';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/callback/:code" element={<CallbackPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;