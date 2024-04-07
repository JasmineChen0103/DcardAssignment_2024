// NewPost.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../components/NewPost.css';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement(document.body);

const NewPost = ({ closeModal }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [selectedRepo, setSelectedRepo] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate(); // 使用 useNavigate

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const accessToken = "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";
                const response = await axios.get(`https://api.github.com/user/repos`, {
                    headers: {
                        Authorization: `token ${accessToken}`
                    }
                });
                setRepositories(response.data);
            } catch (error) {
                console.error('Error fetching repositories:', error);
            }
        };

        fetchRepositories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedRepo.trim() === '') {
                window.alert('Please select a repository.');
                return;
            }
            if (title.trim() === '') {
                window.alert('Title is required.');
                return;
            }
            if (body.trim() === '') {
                window.alert('Body is required.');
                return;
            }
            if (body.length < 30) {
                window.alert('Body should be at least 30 characters long.');
                return;
            }

            const accessToken = "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";
            const response = await axios.post('http://localhost:4000/createIssue', {
                title,
                body,
                selectedRepoId: selectedRepo
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            console.log('Issue created:', response.data);

            closeModal();
            navigate('/');

        } catch (error) {
            console.error('Error adding new post:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="New Post Modal"
        >
            <div className='center'>
                <h2>New Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="repo-label">Select Repository: </label>
                        <select value={selectedRepo} onChange={(e) => setSelectedRepo(e.target.value)}>
                            <option value="">Select Repository</option>
                            {repositories.map(repo => (
                                <option key={repo.id} value={repo.id}>{repo.full_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="repo-label">Title: </label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="repo-label">Body:</label>
                    </div>
                    <div className="form-group">
                        <textarea className='form_body' value={body} onChange={(e) => setBody(e.target.value)} />
                    </div>

                    <button className='submit_button' type="submit">Submit</button>
                </form>
            </div>
        </Modal>
    );
};

export default NewPost;
