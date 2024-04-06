//post.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { parse } from 'marked';
import './Post.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // 导入 Modal 组件
import EditPost from './EditPost';




const Post = ({ userType }) => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [repo, setRepo] = useState("");
    const location = useLocation();
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);

    useEffect(() => {
        if (location.state && location.state.issue) {
            const issue = location.state.issue;

            // 提取 issue 对象中的属性和值
            const { title, body, html_url, user } = issue;

            // 现在你可以在组件中使用这些数据了
            console.log("Issue Title: " + title);
            console.log("Issue Body: " + body);
            console.log("Issue URL: " + html_url);
            var splitString = html_url.split("/"); // 将字符串根据 "/" 进行分割
            setRepo(splitString[4]); // 设置 repo 变量的值
            var repo = splitString[4]; // 获取分割后的第五个部分，即项目名称部分
            console.log(repo);
            console.log("Issue Author: " + user.login);


            console.log(userType);

            setPost(issue); // 设置帖子数据


            // 获取帖子的评论
            const fetchComments = async () => {
                try {
                    // 提取仓库名称
                    const repositoryFullName = issue.repository_url.split('/').slice(-2).join('/');
                    const response = await axios.get(`https://api.github.com/repos/${repositoryFullName}/issues/${issue.number}/comments`);
                    setComments(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching comments:', error);
                    setLoading(false);
                }
            };

            fetchComments();
        }
    }, [location.state]);

    const navigate = useNavigate();

    const handleDelete = async () => {
        const accessToken = "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";
        const { number } = post;
        const repoName = post.html_url.split("/")[4]; // 提取存儲庫名稱
        try {
            // 發送 PATCH 請求以關閉問題
            await axios.patch(`https://api.github.com/repos/DannierForDcard/${repoName}/issues/${number}`, {
                state: "closed" // 設置狀態為 "closed"
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log('Closed issue:', { repo: repoName, number });

            // 在成功關閉問題後，導航到根路徑
            navigate('/'); // 導航到根路徑

        } catch (error) {
            console.error('Error closing issue:', error);
        }
    };

    // 打开编辑模态框
    const openEditModal = () => {
        setEditModalIsOpen(true);
    };


    if (loading) {
        return <p>Loading post...</p>; // 如果还在加载，显示加载中
    }

    const renderMarkdown = (content) => {
        return { __html: parse(content) };
    };

    return (
        <div className='post_container'>
            <div className='post_title'>
                <h2>{post.title}</h2>
                {userType === 1 && (
                    <div>
                        <button className="edit_button" onClick={openEditModal}>編輯</button>
                        <button className="delete_button" onClick={handleDelete}>刪除</button>
                    </div>
                )}
            </div>
            <div className='post_body'>
                <div dangerouslySetInnerHTML={renderMarkdown(post.body)} />
            </div>
            <div>
                <h3 className='post_comments'>Comments</h3>
                {comments.map(comment => (
                    <div key={comment.id} dangerouslySetInnerHTML={renderMarkdown(comment.body)} />
                ))}
            </div>
            {/* 编辑模态框开始 */}
            <Modal
                isOpen={editModalIsOpen}
                onRequestClose={() => setEditModalIsOpen(false)}
                contentLabel="Edit Post Modal"
            >
                <EditPost post={post} closeModal={() => setEditModalIsOpen(false)} />
            </Modal>
            {/* 编辑模态框结束 */}
        </div>
    );
};

export default Post;