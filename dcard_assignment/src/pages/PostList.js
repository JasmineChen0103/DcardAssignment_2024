// PostList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { parse } from 'marked';
import { useNavigate } from 'react-router-dom';

const PostList = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
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

    // 定义点击事件处理函数
    const handleIssueClick = (issue) => {
        navigate(`/post/${issue.id}`, { state: { issue } });
    };

    return (
        <>
            <h1>GitHub Issues</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {issues.map((issue, index) => (
                        <div
                            key={index}
                            onClick={() => handleIssueClick(issue)}
                            style={{
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                padding: '10px',
                                marginBottom: '10px',
                                cursor: 'pointer'
                            }}
                        >
                            <div
                                style={{
                                    height: '25px',
                                    overflow: 'hidden',
                                    backgroundColor: '#f2f2f2',
                                    borderRadius: '8px 8px 0 0',
                                    padding: '10px'
                                }}
                            >
                                <strong>{issue.title}</strong>
                            </div>
                            <div
                                style={{
                                    height: '200px',
                                    overflowY: 'auto',
                                    borderRadius: '0 0 8px 8px',
                                    padding: '10px'
                                }}
                            >
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




