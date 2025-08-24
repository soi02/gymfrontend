import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../styles/EmotionStatsPage.css';
import { useNavigate } from 'react-router-dom';

export default function EmotionStatsPage() {
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [overallStats, setOverallStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useSelector(state => state.auth.id);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('API 호출 전 - userId:', userId);
                console.log('API 호출 전 - token:', token);

                const [monthlyResponse, overallResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/api/diary/stats/monthly-emotions`, {
                        params: { userId },
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(`http://localhost:8080/api/diary/stats/emotions`, {
                        params: { userId },
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                console.log('월간 통계 응답:', monthlyResponse.data);
                console.log('전체 통계 응답:', overallResponse.data);

                // 데이터 구조 확인 및 변환
                const monthlyData = Array.isArray(monthlyResponse.data) ? monthlyResponse.data : [];
                const overallData = Array.isArray(overallResponse.data) ? overallResponse.data : [];

                setMonthlyStats(monthlyData);
                setOverallStats(overallData);
                setLoading(false);
            } catch (error) {
                console.error('통계 데이터 불러오기 실패:', error);
                console.error('에러 상세:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                setError('통계 데이터를 불러오는데 실패했습니다.');
                setLoading(false);
            }
        };

        if (userId) {
            fetchStats();
        } else {
            setError('로그인이 필요합니다.');
            setLoading(false);
        }
    }, [userId]);

    const renderEmotionBar = (emotion, percentage) => (
        <div className="emotion-bar-container" key={emotion}>
            <div className="emotion-label">{emotion}</div>
            <div className="emotion-bar-wrapper">
                <div 
                    className="emotion-bar" 
                    style={{ width: `${percentage}%` }}
                >
                    {percentage.toFixed(1)}%
                </div>
            </div>
        </div>
    );

    const getMonthName = (month) => {
        return new Date(2000, month - 1, 1).toLocaleString('ko-KR', { month: 'long' });
    };

    return (
        <div className="emotion-stats-container">
            <div className="stats-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    &lt;
                </button>
                <h1>감정 통계</h1>
            </div>

            {loading ? (
                <div className="loading">데이터를 불러오는 중...</div>
            ) : (
                <>
                    <section className="stats-section">
                        <h2>전체 감정 분포</h2>
                        <div className="stats-card">
                            {overallStats.length > 0 ? (
                                overallStats.map(stat => 
                                    renderEmotionBar(stat.emotion_name, stat.percentage)
                                )
                            ) : (
                                <div className="no-data-message">전체 감정 데이터가 없습니다.</div>
                            )}
                        </div>
                    </section>

                    <section className="stats-section">
                        <h2>월별 감정 변화</h2>
                        <div className="monthly-stats">
                            {monthlyStats.map((monthData, index) => (
                                <div className="monthly-card" key={index}>
                                    <h3>{getMonthName(monthData.month)}의 주요 감정</h3>
                                    <div className="monthly-emotions">
                                        {monthData.emotions && Array.isArray(monthData.emotions) 
                                            ? monthData.emotions.slice(0, 3).map((emotion, idx) => (
                                                <div className="monthly-emotion-item" key={idx}>
                                                    <span className="emotion-name">
                                                        {emotion.emotion_name}
                                                    </span>
                                                    <span className="emotion-percentage">
                                                        {emotion.percentage.toFixed(1)}%
                                                    </span>
                                                </div>
                                            ))
                                            : <div className="no-data">이 달의 감정 데이터가 없습니다.</div>
                                        }
                                    </div>
                                </div>
                            ))}
                            {monthlyStats.length === 0 && (
                                <div className="no-data-message">월별 감정 데이터가 없습니다.</div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
