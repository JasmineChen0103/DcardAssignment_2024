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

        const queryString = window.location.search; // 获取 URL 中的查询字符串
        const urlParams = new URLSearchParams(queryString); // 使用 URLSearchParams 构造函数解析查询字符串
        const codeParam = urlParams.get("code"); // 获取查询字符串中的 code 参数
        console.log(codeParam); // 在控制台输出 code 参数的值

        if (codeParam && (localStorage.getItem("accessToken") === null)) { // 如果存在 code 参数且尚未存储访问令牌
            async function getAccessToken() {
                await fetch("http://localhost:4000/getAccessToken?code=" + codeParam, { // 发送 GET 请求获取访问令牌
                    method: "GET"
                }).then((response) => {
                    return response.json(); // 解析响应数据为 JSON 格式
                }).then((data) => {
                    console.log(data); // 在控制台输出获取到的访问令牌数据
                    if (data.access_token) { // 如果成功获取到访问令牌
                        localStorage.setItem("accessToken", data.access_token); // 将访问令牌存储到本地存储中
                        setRerender(!rerender); // 触发重新渲染组件
                        getUserData();
                    }
                })
            }
            getAccessToken(); // 调用函数获取访问令牌
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

        console.log("User Type:", userType); // 在這裡 log 出 userType 的值
        localStorage.setItem("userType", userType); // 将 userType 存储到本地存储中

    }, [userType]);


    function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userType");
        setRerender(!rerender);
        setUserType(0);
        window.location.href = "http://localhost:3000/";
    }

    return (
        <Router> {/* 使用 BrowserRouter 组件作为路由的根组件 */}
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

                <Routes> {/* 使用 Routes 组件包裹路由配置 */}
                    <Route path="/" element={<PostList userType={userType} />} /> {/* 当访问根路径时，渲染 Home 组件 */}
                    <Route path="/new-post" element={<NewPost />} />
                    <Route path="/post/:id" element={<Post userType={userType} />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App; // 导出 App 组件



