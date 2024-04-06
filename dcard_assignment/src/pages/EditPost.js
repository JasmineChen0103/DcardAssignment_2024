// EditPost.js

import React, { useState } from 'react';
import axios from 'axios';
import './EditPost.css';

const EditPost = ({ post, closeModal }) => {
    const [title, setTitle] = useState(post.title);
    const [body, setBody] = useState(post.body);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = "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";

            // 发送 PATCH 请求以更新 issue
            await axios.patch(post.url, {
                title,
                body
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log('Updated issue:', { title, body });

            closeModal(); // 关闭编辑模态框

        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <div className='center'>
            <h2>Edit Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="repo-label">Repository: </label>
                </div>
                <div className="form-group">
                    <label className="repo-label">Title: </label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="repo-label">Body:</label>
                    <textarea className='form_body' value={body} onChange={(e) => setBody(e.target.value)} />
                </div>

                <button className='submit_button' type="submit">Submit</button>
            </form>
        </div>
    );
};

export default EditPost;

