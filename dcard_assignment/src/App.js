//App.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Post from './pages/Post';
import React, { useEffect, useState } from 'react';
import GitHubLogo from './assets/github-logo.png';
import './components/Navbar.css';
import PostList from './pages/PostList';
import NewPost from './pages/NewPost';


const clientId = "20b6da379f6121cedbe4";

const App = () => {

    const [rerender, setRerender] = useState(false);
    const [userData, setUserData] = useState({});
    const [userType, setUserType] = useState(0);

    useEffect(() => {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code");
        console.log(codeParam);

        if (codeParam && (localStorage.getItem("accessToken") === null)) {
            async function getAccessToken() {
                await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, {
                    method: "GET"
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    console.log(data);
                    if (data.access_token) {
                        localStorage.setItem("accessToken", data.access_token);
                        setRerender(!rerender);
                        getUserData();
                    }
                })
            }
            getAccessToken();
        }

    }, []);


    function handleLogin() {
        window.location.href = (`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user%20user:email`);
    };


    async function getUserData() {
        await fetch("http://localhost:4000/getUserData", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("accessToken")
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            setUserData(data);
            setUserType(data.login === "DannierForDcard" ? 1 : 2);
        })
    }

    useEffect(() => {

        console.log("User Type:", userType);
        localStorage.setItem("userType", userType);

    }, [userType]);


    function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userType");
        setRerender(!rerender);
        setUserType(0);
        window.location.href = "http://localhost:3000/";
    }

    return (
        <Router>
            <div>
                <nav className="navbar">
                    <div className="navbar-left">
                        <img src={GitHubLogo} alt="GitHub Logo" className="github-logo" />
                    </div>
                    <div className="navbar-right">
                        {localStorage.getItem("accessToken") ?
                            <>
                                <button className="login-button" onClick={handleLogout}>
                                    登出
                                </button>
                            </>
                            :
                            <>
                                <button className="login-button" onClick={handleLogin}>
                                    登入
                                </button>
                            </>
                        }

                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<PostList userType={userType} />} />
                    <Route path="/new-post" element={<NewPost />} />
                    <Route path="/post/:id" element={<Post userType={userType} />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;



