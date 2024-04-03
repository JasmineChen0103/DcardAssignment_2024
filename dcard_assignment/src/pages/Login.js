//Login.js

import React from 'react';

const Login = () => {
    const handleLogin = () => {
        const clientId = '80959feac4174348bcda';
        const redirectUri = 'http://localhost:3000/';
        const scope = 'user:email';

        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    };

    return (
        <button className="login-button" onClick={handleLogin}>
            登入
        </button>
    );
};

export default Login;