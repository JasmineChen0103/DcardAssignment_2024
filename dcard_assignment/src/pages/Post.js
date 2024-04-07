//post.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { parse } from 'marked';
import '../components/Post.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
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

            // 提取 issue 屬性的值
            const { title, body, html_url, user } = issue;

            console.log("Issue Title: " + title);
            console.log("Issue Body: " + body);
            console.log("Issue URL: " + html_url);
            //拿是哪個repository
            var splitString = html_url.split("/");
            setRepo(splitString[4]);
            var repo = splitString[4];
            console.log(repo);
            console.log("Issue Author: " + user.login);


            console.log(userType);

            setPost(issue);


            // 抓評論
            const fetchComments = async () => {
                try {
                    // 先抓repository名稱
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
        const repoName = post.html_url.split("/")[4]; // 抓repository名稱
        try {
            // 發送 PATCH 請求 close issue
            await axios.patch(`https://api.github.com/repos/DannierForDcard/${repoName}/issues/${number}`, {
                state: "closed"
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log('Closed issue:', { repo: repoName, number });

            navigate('/');

        } catch (error) {
            console.error('Error closing issue:', error);
        }
    };

    const openEditModal = () => {
        setEditModalIsOpen(true);
    };

    // 如果還在載顯示下載中
    if (loading) {
        return <p>Loading post...</p>;
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

            {/* 編輯模式 */}
            <Modal
                isOpen={editModalIsOpen}
                onRequestClose={() => setEditModalIsOpen(false)}
                contentLabel="Edit Post Modal"
            >
                <EditPost post={post} closeModal={() => setEditModalIsOpen(false)} />
            </Modal>

        </div>
    );
};

export default Post;