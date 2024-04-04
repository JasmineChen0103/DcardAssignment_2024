//post.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { parse } from 'marked';

const Post = () => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.issue) {
            const issue = location.state.issue;
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

    if (loading) {
        return <p>Loading post...</p>; // 如果还在加载，显示加载中
    }

    const renderMarkdown = (content) => {
        return { __html: parse(content) };
    };

    return (
        <div>
            <h2>{post.title}</h2>
            <div dangerouslySetInnerHTML={renderMarkdown(post.body)} />
            <h3>Comments:</h3>
            <div>
                {comments.map(comment => (
                    <div key={comment.id} dangerouslySetInnerHTML={renderMarkdown(comment.body)} />
                ))}
            </div>
        </div>
    );
};

export default Post;
