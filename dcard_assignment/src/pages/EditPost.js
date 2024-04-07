// EditPost.js

import React, { useState } from 'react';
import axios from 'axios';
import '../components/EditPost.css';
import { useNavigate } from 'react-router-dom';

const EditPost = ({ post, closeModal }) => {
    const [title, setTitle] = useState(post.title);
    const [body, setBody] = useState(post.body);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = "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";

            // PATCH請求更新issue
            await axios.patch(post.url, {
                title,
                body
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log('Updated issue:', { title, body });

            closeModal();
            navigate('/');

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

