// Home.js

import React, { useEffect, useState } from 'react'; // 导入 React 库中的 useEffect 和 useState 钩子
import PostList from './PostList'; // 导入 PostList 组件，用于显示帖子列表

const Home = () => {
    const [rerender, setRerender] = useState(false); // 使用 useState() 钩子来创建状态 rerender，用于强制重新渲染组件
    const [userData, setUserData] = useState({}); // 使用 useState() 钩子来创建状态 userData，用于存储用户数据

    async function getUserData() {
        await fetch("http://localhost:4000/getUserData", { // 发送 GET 请求获取用户数据
            method: "GET",
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("accessToken") // 设置请求头中的 Authorization 字段，携带用户的访问令牌
            }
        }).then((response) => {
            return response.json(); // 解析响应数据为 JSON 格式
        }).then((data) => {
            console.log(data); // 在控制台输出获取到的用户数据
            setUserData(data); // 更新状态 userData，存储获取到的用户数据
        })
    }

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
                    }
                })
            }

            getAccessToken(); // 调用函数获取访问令牌
        }
    }, [rerender]); // useEffect 钩子的依赖项为 rerender，当 rerender 状态改变时，重新执行 useEffect 中的逻辑

    return (
        <>
            <PostList currentUser={userData.login} /> {/* 渲染 PostList 组件，并将当前用户的登录名传递给组件 */}
        </>
    );
};

export default Home; // 导出 Home 组件
