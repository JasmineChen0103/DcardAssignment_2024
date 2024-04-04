//CallbackPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CallbackPage = () => {
    const { code } = useParams(); // 使用 useParams() 钩子获取 URL 参数中的授权码
    const [username, setUsername] = useState(null); // 使用 useState() 來保存使用者名稱

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const response = await fetch(`/getAccessToken?code=${code}`);
                const data = await response.json();

                if (data.access_token) {
                    const accessToken = data.access_token;

                    const userDataResponse = await fetch('/getUserData', {
                        method: 'GET',
                        headers: {
                            Authorization: accessToken,
                        },
                    });
                    const userData = await userDataResponse.json();

                    // 從使用者資料中提取使用者名稱並設置到狀態中
                    setUsername(userData.login);
                } else {
                    console.error('Failed to fetch access token:', data.error);
                }
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        };

        fetchAccessToken();
    }, [code]);

    return (
        <div>
            <h2>Callback Page</h2>
            <p>Authorization Code: {code}</p>
            {username && <p>Welcome {username}</p>} {/* 如果使用者名稱存在，則顯示歡迎訊息 */}
        </div>
    );
};

export default CallbackPage;

