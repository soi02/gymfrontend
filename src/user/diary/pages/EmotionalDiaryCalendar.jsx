// src/components/EmotionalDiaryCalendar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { diaryService } from '../service/diaryService';
import '../styles/EmotionalDiaryCalendar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const EmotionalDiaryCalendar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, id } = useSelector(state => state.auth);
  const [diaries, setDiaries] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/diary/calendar' } });
    }
  }, [isAuthenticated, navigate]);

  const fetchDiaryData = async () => {
    try {
      setIsLoading(true);
      const [diaryList, emotionList] = await Promise.all([
        diaryService.getDiaryList(id),
        diaryService.getEmojis()
      ]);
      setDiaries(diaryList);
      setEmotions(emotionList);
    } catch (error) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error('데이터 조회 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchDiaryData();
    }
  }, [isAuthenticated, id]);

  const getFormattedLocalDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    const firstDayIndex = firstDay.getDay();
    for (let i = 0; i < firstDayIndex; i++) {
        days.push({
            date: new Date(year, month, -firstDayIndex + i + 1),
            isCurrentMonth: false,
            hasEntry: false
        });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateString = getFormattedLocalDate(date);
      const diaryEntry = diaries.find(d => d.created_at.startsWith(dateString));

      days.push({
        date: date,
        isCurrentMonth: true,
        hasEntry: !!diaryEntry,
        emotion: diaryEntry ? emotions.find(e => e.id === diaryEntry.emoji_id) : null
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({
            date: new Date(year, month + 1, i),
            isCurrentMonth: false,
            hasEntry: false
        });
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    const dateString = getFormattedLocalDate(day.date);
    navigate('/diary', { state: { selectedDate: dateString } });
  };

  if (!isAuthenticated) return null;

  const days = getDaysInMonth();
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

return (
    <div className="diary-calendar">
      <div className="diary-calendar-header">
        <button className="diary-back-btn" onClick={() => navigate('/diary')}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <h2 className="diary-calendar-title">감정 일기 캘린더</h2>
      </div>

      <div className="diary-calendar-navigation">
        <button onClick={prevMonth}><i className="bi bi-chevron-left"></i></button>
        <h3>{currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}</h3>
        <button onClick={nextMonth}><i className="bi bi-chevron-right"></i></button>
      </div>

      {error && <div className="diary-error-message">{error}</div>}

      {isLoading ? (
        <div className="diary-loading">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">로딩중...</span>
          </div>
        </div>
      ) : (
        <div className="diary-calendar-grid">
          <div className="diary-calendar-weekdays">
            <div>일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div>토</div>
          </div>
          <div className="diary-calendar-days">
            {days.map((day, index) => (
              <div
                key={index}
                className={`diary-calendar-day ${!day.isCurrentMonth ? 'other-month' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <span className="diary-day-number">{day.date.getDate()}</span>
                {day.hasEntry && day.emotion && (
                  <img
                    src={`http://localhost:8080/uploadFiles${day.emotion.emoji_image}`}
                    alt={day.emotion.name}
                    className="diary-emotion-indicator"
                    onError={(e) => { // 이미지 로드 실패 시 에러 처리
                      e.target.style.display = 'none';
                      console.error(`이미지 로드 실패: ${e.target.src}`);
                      // 사용자에게는 보이지 않게 처리하고, 에러는 콘솔에 출력
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionalDiaryCalendar;