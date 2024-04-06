// PostList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parse } from 'marked';
import { useNavigate } from 'react-router-dom';
import './PostList.css';
import Modal from 'react-modal';
import NewPost from './NewPost';

const PostList = ({ userType }) => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const accessToken = "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";

                // Step 1: 获取特定用户的所有存储库列表
                const repoResponse = await axios.get(`https://api.github.com/users/DannierForDcard/repos`, {
                    headers: {
                        Authorization: `token ${accessToken}`
                    }
                });

                const repos = repoResponse.data.map(repo => repo.full_name);

                // Step 2: 遍历存储库列表，获取每个存储库的 issue 数据
                const issuePromises = repos.map(async repo => {
                    console.log(`Fetching issues for repository: ${repo} - Page: ${page}`);
                    const response = await axios.get(`https://api.github.com/repos/${repo}/issues?per_page=10&page=${page}`, {
                        headers: {
                            Authorization: `token ${accessToken}`
                        }
                    });
                    return response.data;
                });

                // Step 3: 将每个存储库的 issue 数据合并到一个数组中
                const issueData = await Promise.all(issuePromises);
                const mergedIssues = issueData.flat();

                // 将 Markdown 内容转换为 HTML
                mergedIssues.forEach(issue => {
                    if (issue.body) {
                        issue.body_html = parse(issue.body);
                    }
                });

                // Step 4: 更新状态以渲染页面
                setIssues(prevIssues => [...prevIssues, ...mergedIssues]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching issues:', error);
            }
        };


        fetchIssues();
    }, [page]);

    const handleScroll = () => {
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (bottom) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 點各個issue
    const handleIssueClick = (issue) => {
        console.log(issue);
        navigate(`/post/${issue.id}`, { state: { issue } });
    };

    // 開啟 Modal 函數
    const openModal = () => {
        setModalIsOpen(true);
    };

    // 關閉 Modal 函數
    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <>
            <h1>GitHub Issues</h1>
            {userType === 1 && (
                <button className="new-post-button" onClick={openModal}>New Post</button>
            )}
            {/* Modal 開始 */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="New Post Modal"
            >
                <NewPost closeModal={closeModal} />
            </Modal>
            {/* Modal 結束 */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {issues.map((issue, index) => (
                        <div className='issue_container'
                            key={index}
                            onClick={() => handleIssueClick(issue)}
                        >
                            <div className='issue_title'>
                                <strong>{issue.title}</strong>
                            </div>
                            <div className='issue_body'>
                                <div dangerouslySetInnerHTML={{ __html: issue.body_html }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default PostList;