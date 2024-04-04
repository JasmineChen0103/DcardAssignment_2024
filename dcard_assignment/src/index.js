//index.js

import React from 'react'; // 导入 React 库
import App from './App'; // 导入 App 组件
import ReactDOM from 'react-dom/client'; // 导入 ReactDOM 库，用于将 React 组件渲染到 DOM 上

const root = document.getElementById('root'); // 获取 HTML 页面中的根 DOM 元素
const rootElement = (
    <React.StrictMode> {/* 使用 React.StrictMode 组件包裹 App 组件，启用严格模式 */}
        <App /> {/* 渲染 App 组件 */}
    </React.StrictMode>
);

const rootInstance = ReactDOM.createRoot(root); // 创建根 fiber
rootInstance.render(rootElement); // 将根组件渲染到根 DOM 元素上