//Home.js

import React, { useEffect, useState } from 'react';
import PostList from './PostList';
import Navbar from '../components/Navbar';

const Home = () => {
    const [rerender, setRerender] = useState(false);
    const [userData, setUserData] = useState({});

    async function getUserData() {
        await fetch("http://localhost:4000/getUserData", {
            method: "GET",
            headers: {
                "Authorization": "Bearer" + localStorage.getItem("accessToken")
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            setUserData(data);
        })
    }

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
                    }
                })
            }

            getAccessToken();
        }
    }, [rerender]);

    return (
        <>
            <Navbar />
            <PostList />
        </>
    );
};

export default Home;
