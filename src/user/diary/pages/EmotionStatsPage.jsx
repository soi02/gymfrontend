import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../styles/EmotionStatsPage.css';
import { useNavigate } from 'react-router-dom';
import MeditationTexts from '../constants/meditationTexts';

const EmotionStatsPage = () => {
    const currentDate = new Date();
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
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
                setLoading(true);
                const token = localStorage.getItem('token');
                
                // startDate와 endDate 계산
                const startDate = `${currentYear}-${String(selectedMonth).padStart(2, '0')}-01`;
                const lastDay = new Date(currentYear, selectedMonth, 0).getDate();
                const endDate = `${currentYear}-${String(selectedMonth).padStart(2, '0')}-${lastDay}`;

                const [monthlyResponse, overallResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/api/diary/stats/monthly-emotions`, {
                        params: { 
                            userId,
                            startDate,
                            endDate
                        },
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
                setError(null);
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
    }, [userId, currentYear, selectedMonth]);

    const renderMonthlyContent = () => {
        if (monthlyStats.length === 0) {
            return (
                <div className="diaryStat-no-data-message">
                    <i className="bi bi-emoji-neutral"></i>
                    <p>이번 달엔 분석할 데이터가 없습니다.</p>
                    <p>일기를 작성하고 감정 통계를 확인해보세요!</p>
                    {/* <button 
                        className="diaryStat-write-diary-button"
                        onClick={() => navigate('/diary/calendar')}
                    >
                        <i className="bi bi-pencil"></i>
                        일기 쓰러가기
                    </button> */}
                </div>
            );
        }

        return (
            <>
                <section className="diaryStat-trend-section">
                    <h3>기분 추이</h3>
                    <div className="diaryStat-trend-graph">
                        <svg className="diaryStat-line-graph" viewBox="0 0 300 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#FFD700" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {monthlyStats.length > 0 && (
                                <>
                                    <path
                                        d={`M 0,${100 - (monthlyStats[0]?.count || 0)} 
                                           ${monthlyStats.map((stat, index) => {
                                                const x = (300 / Math.max(monthlyStats.length - 1, 1)) * index;
                                                const y = 100 - (stat?.count || 0);
                                                return `L ${x},${y}`;
                                            }).join(' ')} 
                                           L 300,100 L 0,100 Z`}
                                        fill="url(#lineGradient)"
                                    />
                                    <path
                                        d={`M 0,${100 - (monthlyStats[0]?.count || 0)} 
                                           ${monthlyStats.map((stat, index) => {
                                                const x = (300 / Math.max(monthlyStats.length - 1, 1)) * index;
                                                const y = 100 - (stat?.count || 0);
                                                return `L ${x},${y}`;
                                            }).join(' ')}`}
                                        fill="none"
                                        stroke="#FFD700"
                                        strokeWidth="2"
                                    />
                                </>
                            )}
                        </svg>
                        <div className="diaryStat-trend-points">
                            {[1, 15, 30].map((day) => (
                                <div className="diaryStat-trend-point" key={day}>
                                    <div className="diaryStat-point" style={{
                                        backgroundColor: monthlyStats.find(stat => parseInt(stat?.day) === day)?.count > 0 
                                            ? '#FFD700' 
                                            : '#ddd'
                                    }}></div>
                                    <div className="diaryStat-date">{day}일</div>
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
                        {console.log('monthlyStats:', monthlyStats)}
                        {MeditationTexts.getMeditationByTopEmotions(monthlyStats).map((meditation, index) => (
                            <div className="diaryStat-insight-card" key={index}>
                                <div className="diaryStat-insight-icon">
                                    {index === 0 && <i className="bi bi-sun"></i>}
                                    {index === 1 && <i className="bi bi-emoji-smile"></i>}
                                    {index === 2 && <i className="bi bi-star"></i>}
                                </div>
                                <div className="diaryStat-insight-text">
                                    {meditation}
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
                {activeTab === 'monthly' && (
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
                )}
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
                <div className="diaryStat-content">
                    <section className="diaryStat-total-distribution-section">
                        <h3>전체 기간 감정 분포</h3>
                        <div className="diaryStat-total-pie-chart">
                            <div className="diaryStat-pie-container">
                                <svg viewBox="0 0 100 100" className="diaryStat-pie">
                                    {overallStats.map((stat, index, array) => {
                                        // 파이 차트 계산
                                        let total = 0;
                                        array.slice(0, index).forEach(s => total += s.percentage);
                                        const startAngle = (total * 3.6) - 90; // 백분율을 각도로 변환 (1% = 3.6도)
                                        const endAngle = ((total + stat.percentage) * 3.6) - 90;
                                        
                                        // SVG path 계산
                                        const startX = 50 + 50 * Math.cos(startAngle * Math.PI / 180);
                                        const startY = 50 + 50 * Math.sin(startAngle * Math.PI / 180);
                                        const endX = 50 + 50 * Math.cos(endAngle * Math.PI / 180);
                                        const endY = 50 + 50 * Math.sin(endAngle * Math.PI / 180);
                                        
                                        const largeArcFlag = stat.percentage > 50 ? 1 : 0;
                                        
                                        return (
                                            <path
                                                key={index}
                                                d={`M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                                                className={`diaryStat-pie-slice-${index}`}
                                            />
                                        );
                                    })}
                                </svg>
                            </div>
                            <div className="diaryStat-pie-legend">
                                {overallStats.map((stat, index) => (
                                    <div className="diaryStat-pie-legend-item" key={index}>
                                        <div className="diaryStat-legend-icon">
                                            <img 
                                                src={`http://localhost:8080/uploadFiles${stat.emoji_image}`}
                                                alt={stat.emotion_name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/default_profile_img.svg';
                                                }}
                                            />
                                        </div>
                                        <div className="diaryStat-legend-info">
                                            <span className="diaryStat-emotion-name">{stat.emotion_name}</span>
                                            <span className="diaryStat-percentage">{stat.percentage.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
