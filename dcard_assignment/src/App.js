//App.js

import React from 'react'; // 导入 React 库
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // 导入 BrowserRouter、Route 和 Routes 组件，用于实现路由功能
import Navbar from './components/Navbar'; // 导入 Navbar 组件，用于显示导航栏
import Home from './pages/Home'; // 导入 Home 组件，用于显示主页内容
import Post from './pages/Post'; // 导入 Post 组件，用于显示帖子内容
import CallbackPage from './pages/CallbackPage'; // 导入 CallbackPage 组件，用于处理回调页面

const App = () => {
    return (
        <Router> {/* 使用 BrowserRouter 组件作为路由的根组件 */}
            <div>
                <Navbar /> {/* 渲染导航栏组件 */}
                <Routes> {/* 使用 Routes 组件包裹路由配置 */}
                    <Route path="/" element={<Home />} /> {/* 当访问根路径时，渲染 Home 组件 */}
                    <Route path="/callback/:code" element={<CallbackPage />} /> {/* 当访问 /callback/:code 路径时，渲染 CallbackPage 组件 */}
                    <Route path="/post/:id" element={<Post />} /> {/* 当访问 /post/:id 路径时，渲染 Post 组件 */}
                </Routes>
            </div>
        </Router>
    );
};

export default App; // 导出 App 组件



