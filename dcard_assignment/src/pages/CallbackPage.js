import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const CallbackPage = () => {
    const { code } = useParams(); // 使用 useParams() 钩子获取 URL 参数中的授权码

    useEffect(() => {
        // 在这里处理授权码，例如将其发送到后端进行验证和交换
        console.log('Authorization Code:', code);
    }, [code]);

    return (
        <div>
            <h2>Callback Page</h2>
            <p>Authorization Code: {code}</p>
        </div>
    );
};

export default CallbackPage;