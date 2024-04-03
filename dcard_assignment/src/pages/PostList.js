//PostList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parse } from 'marked'; // 導入 parse 函數
import { useHistory } from 'react-router-dom';

const PostList = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const history = useHistory();

    const handleIssueClick = (issueId) => {
        history.push(`/post/${issueId}`); // 导航到相应的Post页面
    };

    useEffect(() => {
        const fetchIssues = async () => {
            try {

                const accessToken = "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"

                // Step 1: 獲取特定用戶的所有儲存庫列表
                const repoResponse = await axios.get(`https://api.github.com/users/DannierForDcard/repos`, {
                    headers: {
                        Authorization: `token ${accessToken}`
                    }
                });

                const repos = repoResponse.data.map(repo => repo.full_name);

                // Step 2: 遍歷儲存庫列表，獲取每個儲存庫的 issue 數據
                const issuePromises = repos.map(async repo => {
                    const response = await axios.get(`https://api.github.com/repos/${repo}/issues?per_page=10&page=${page}`, {
                        headers: {
                            Authorization: `token ${accessToken}`
                        }
                    });
                    return response.data;
                });

                // Step 3: 將每個儲存庫的 issue 數據合併到一個數組中
                const issueData = await Promise.all(issuePromises);
                const mergedIssues = issueData.flat();

                // 将 Markdown 內容转换为 HTML
                mergedIssues.forEach(issue => {
                    if (issue.body) { // 添加安全性检查，确保 body 不为空
                        issue.body_html = parse(issue.body); // 使用 parse 函數
                    }
                });

                // Step 4: 更新狀態以渲染頁面

                // 在每次更新 issue 列表之前先清空它
                setIssues([]);

                // 將新的 issue 添加到列表中
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

    return (
        <>
            <h1>GitHub Issues</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                // <ul>
                //     {issues.map(issue => (
                //         <li key={issue.id}>
                //             <strong>{issue.title}</strong> - <div dangerouslySetInnerHTML={{ __html: issue.body_html }} />
                //         </li>
                //     ))}
                // </ul>
                <ul>
                    {issues.map(issue => (
                        <li key={issue.id}>
                            <div
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleIssueClick(issue.id)} // 点击容器时触发事件
                            >
                                <strong>{issue.title}</strong>
                                <div dangerouslySetInnerHTML={{ __html: issue.body_html }} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default PostList;



