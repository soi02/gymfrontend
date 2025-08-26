import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../styles/EmotionStatsPage.css';
import { useNavigate } from 'react-router-dom';

const EmotionStatsPage = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const [monthlyStats, setMonthlyStats] = useState([]);
    const [overallStats, setOverallStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('monthly');
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const userId = useSelector(state => state.auth.id);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
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

                const monthlyData = Array.isArray(monthlyResponse.data) ? monthlyResponse.data : [];
                const overallData = Array.isArray(overallResponse.data) ? overallResponse.data : [];

                setMonthlyStats(monthlyData);
                setOverallStats(overallData);
                setLoading(false);
            } catch (error) {
                console.error('통계 데이터 불러오기 실패:', error);
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

    const renderMonthlyContent = () => {
        if (monthlyStats.length === 0) {
            return (
                <div className="diaryStat-no-data-message">
                    <i className="bi bi-emoji-neutral"></i>
                    <p>이번 달엔 분석할 데이터가 없습니다.</p>
                    <p>일기를 작성하고 감정 통계를 확인해보세요!</p>
                </div>
            );
        }

        return (
            <>
                <section className="diaryStat-trend-section">
                    <h3>기분 추이</h3>
                    <div className="diaryStat-trend-graph">
                        <svg className="diaryStat-line-graph" viewBox="0 0 300 100" preserveAspectRatio="none">
                            <polyline
                                points={monthlyStats
                                    .map((stat, index) => {
                                        const x = (300 / (monthlyStats.length - 1)) * index;
                                        const y = 100 - (stat.emotions?.[0]?.percentage || 0);
                                        return `${x},${y}`;
                                    })
                                    .join(' ')}
                                fill="none"
                                stroke="#FFD700"
                                strokeWidth="2"
                            />
                        </svg>
                        <div className="diaryStat-trend-points">
                            {monthlyStats.map((stat, index) => (
                                <div className="diaryStat-trend-point" key={index}>
                                    <div className="diaryStat-point" style={{
                                        backgroundColor: stat.emotions?.[0]?.percentage > 0 ? '#FFD700' : '#ddd'
                                    }}></div>
                                    <div className="diaryStat-date">{stat.day || index + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="diaryStat-distribution-section">
                    <h3>기분 분포</h3>
                    <div className="diaryStat-emotion-distribution">
                        {overallStats.map((stat, index) => (
                            <div className="diaryStat-emotion-item" key={index}>
                                <div className="diaryStat-emotion-icon">
                                    <img 
                                        src={`http://localhost:8080/uploadFiles${stat.emoji_image}`}
                                        alt={stat.emotion_name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/images/default_profile_img.svg';
                                        }}
                                    />
                                </div>
                                <div className="diaryStat-emotion-percentage">
                                    {stat.percentage.toFixed(0)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="diaryStat-monthly-insight-section">
                    <h3>이달의 명상</h3>
                    <div className="diaryStat-insight-cards">
                        {monthlyStats.slice(0, 3).map((data, index) => (
                            <div className="diaryStat-insight-card" key={index}>
                                <div className="diaryStat-insight-icon">
                                    {index === 0 && <i className="bi bi-sun"></i>}
                                    {index === 1 && <i className="bi bi-emoji-smile"></i>}
                                    {index === 2 && <i className="bi bi-star"></i>}
                                </div>
                                <div className="diaryStat-insight-text">
                                    {data.description || '데이터가 충분하지 않습니다.'}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </>
        );
    };

    return (
        <div className="diaryStat-container">
            <div className="diaryStat-header">
                <button className="diaryStat-back-button" onClick={() => navigate(-1)}>
                    <i className="bi bi-chevron-left"></i>
                </button>
                <h2>감정 일기 리포트</h2>
                <div className="diaryStat-date-selector">
                    <select 
                        value={currentYear}
                        onChange={(e) => {/* TODO: 년도 변경 처리 */}}
                        className="diaryStat-year-dropdown"
                    >
                        {[2024, 2025].map(year => (
                            <option key={year} value={year}>
                                {year}년
                            </option>
                        ))}
                    </select>
                    <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="diaryStat-month-dropdown"
                    >
                        {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>
                                {month}월
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="diaryStat-tabs">
                <button 
                    className={`diaryStat-tab-button ${activeTab === 'monthly' ? 'active' : ''}`}
                    onClick={() => setActiveTab('monthly')}
                >
                    월간
                </button>
                <button 
                    className={`diaryStat-tab-button ${activeTab === 'total' ? 'active' : ''}`}
                    onClick={() => setActiveTab('total')}
                >
                    전체
                </button>
            </div>

            {loading ? (
                <div className="diaryStat-loading">데이터를 불러오는 중...</div>
            ) : error ? (
                <div className="diaryStat-error-message">{error}</div>
            ) : activeTab === 'total' ? (
                <div className="diaryStat-content diaryStat-total-content">
                    <section className="diaryStat-total-distribution-section">
                        <h3>전체 기간 감정 분포</h3>
                        <div className="diaryStat-total-distribution-chart">
                            {overallStats.map((stat, index) => (
                                <div className="diaryStat-total-emotion-bar" key={index}>
                                    <div className="diaryStat-emotion-icon">
                                        <img 
                                            src={`http://localhost:8080/uploadFiles${stat.emoji_image}`}
                                            alt={stat.emotion_name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/default_profile_img.svg';
                                            }}
                                        />
                                    </div>
                                    <div className="diaryStat-bar-container">
                                        <div 
                                            className="diaryStat-bar" 
                                            style={{width: `${stat.percentage}%`}}
                                        />
                                        <span className="diaryStat-percentage">{stat.percentage.toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            ) : (
                <div className="diaryStat-content">
                    {renderMonthlyContent()}
                </div>
            )}
        </div>
    );
};

export default EmotionStatsPage;
