// PostList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parse } from 'marked';
import { useNavigate } from 'react-router-dom';
import '../components/PostList.css';
import Modal from 'react-modal';
import NewPost from './NewPost';

const PostList = ({ userType }) => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [globalIssueNumber, setGlobalIssueNumber] = useState(0);
    const navigate = useNavigate();
    const [loadIssueNum, setLoadIssueNum] = useState(10);
    const [GlobalIssueNum, setGlobalIssueNum] = useState(0);




    useEffect(() => {
        const fetchAllIssues = async () => {
            try {
                const accessToken = "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";

                // 取所有repository
                const repoResponse = await axios.get(`https://api.github.com/users/DannierForDcard/repos`, {
                    headers: {
                        Authorization: `token ${accessToken}`
                    }
                });

                const repos = repoResponse.data.map(repo => repo.full_name);

                // 抓每個repository的所有issue
                const issuePromises = repos.map(async repo => {
                    const response = await axios.get(`https://api.github.com/repos/${repo}/issues`, {
                        headers: {
                            Authorization: `token ${accessToken}`
                        },
                        params: {
                            per_page: 100  // 每個repository issue的上限
                        }
                    });
                    return response.data;
                });

                // 將每個repository的issue合併到一個數組
                const issueData = await Promise.all(issuePromises);
                const mergedIssues = issueData.flat();

                // 給所有issue全局編號
                const numberedIssues = mergedIssues.map((issue, index) => ({
                    ...issue,
                    globalNumber: globalIssueNumber + index + 1
                }));

                // markdown轉html
                numberedIssues.forEach(issue => {
                    if (issue.body) {
                        issue.body_html = parse(issue.body);
                    }
                });

                // 更新狀態
                setIssues(prevIssues => [...prevIssues, ...numberedIssues]);
                setLoading(false);

                setGlobalIssueNum(mergedIssues.length);

                //console.log("Last Global Issue Number:", mergedIssues.length);

            } catch (error) {
                console.error('Error fetching issues:', error);
            }
        };

        fetchAllIssues();
    }, [page]);

    // 控制滾輪
    const handleScroll = () => {
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
        if (bottom) {
            setLoadIssueNum(prevNum => prevNum + 10);
            console.log("loadNum: ", loadIssueNum);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 點各個issue進入文章頁
    const handleIssueClick = (issue) => {
        navigate(`/post/${issue.id}`, { state: { issue } });
    };

    // 開啟 Modal
    const openModal = () => {
        setModalIsOpen(true);
    };

    // 關閉 Modal
    const closeModal = () => {
        setModalIsOpen(false);
    };

    // 把issue body的markdown語法拿掉
    const removeMarkdownSyntax = (markdownString) => {

        let withoutHeaders = markdownString.replace(/^#+\s*(.*)$/gm, '$1');
        withoutHeaders = withoutHeaders.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
        withoutHeaders = withoutHeaders.replace(/\[(.*?)\]\(.*?\)/g, '$1');
        withoutHeaders = withoutHeaders.replace(/`(.*?)`/g, '$1')
        withoutHeaders = withoutHeaders.replace(/!\[.*?\]\(.*?\)/g, '');

        return withoutHeaders;
    };



    return (
        <>
            <h1>GitHub Issues</h1>
            {userType === 1 && (
                <button className="new-post-button" onClick={openModal}>New Post</button>
            )}
            {/* 新增模式 */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="New Post Modal"
            >
                <NewPost closeModal={closeModal} />
            </Modal>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {/* 10個10個顯示 */}
                    {issues.slice(0, loadIssueNum).map((issue, index) => (
                        <div className='issue_container' key={index} onClick={() => handleIssueClick(issue)}>
                            <div className='issue_title'>
                                <strong>{issue.globalNumber + ". " + issue.title}</strong>
                            </div>
                            <div className='issue_body'>
                                <div>{removeMarkdownSyntax(issue.body)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default PostList;