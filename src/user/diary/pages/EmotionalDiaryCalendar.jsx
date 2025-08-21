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
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

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
    const days = [];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 캘린더 시작점을 월요일로 맞춤
    const firstDayIndex = (firstDay.getDay() + 6) % 7; // 0(월) ~ 6(일)
    for (let i = 0; i < firstDayIndex; i++) {
        const prevMonthDay = new Date(year, month, i - firstDayIndex + 1);
        days.push({
            date: prevMonthDay,
            isCurrentMonth: false,
            hasEntry: false
        });
    }

    // 현재 달의 날짜 추가
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

    // 다음 달의 날짜를 추가하여 캘린더 그리드를 6x7 = 42개로 채움
    const totalDays = days.length;
    const remainingDays = 42 - totalDays;
    for (let i = 1; i <= remainingDays; i++) {
        const nextMonthDay = new Date(year, month + 1, i);
        days.push({
            date: nextMonthDay,
            isCurrentMonth: false,
            hasEntry: false
        });
    }

    return days;
  };

  const handleMonthChange = (year, month) => {
    setCurrentDate(new Date(year, month));
    setIsMonthPickerOpen(false);
  };

  const handleDayClick = (day) => {
    const dateString = getFormattedLocalDate(day.date);
    navigate('/diary', { state: { selectedDate: dateString } });
  };

  if (!isAuthenticated) return null;

  const days = getDaysInMonth();
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);

  return (
    <div className="diary-calendar">
      <div className="diary-calendar-header">
        <h2 className="diary-calendar-title">무드 캘린더</h2>
        <div className="header-icons">
          <i className="bi bi-search"></i>
          <i className="bi bi-upload"></i>
        </div>
      </div>

      <div className="diary-calendar-navigation">
        <div className="month-picker-container">
          <button className="month-picker-btn" onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}>
            {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
            <i className="bi bi-caret-down-fill"></i>
          </button>
          {isMonthPickerOpen && (
            <div className="month-picker-dropdown">
              <div className="year-selector">
                <select
                  value={currentDate.getFullYear()}
                  onChange={(e) => setCurrentDate(new Date(e.target.value, currentDate.getMonth()))}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
              </div>
              <div className="month-grid">
                {monthNames.map((monthName, index) => (
                  <button
                    key={index}
                    className={`month-btn ${index === currentDate.getMonth() ? 'active' : ''}`}
                    onClick={() => handleMonthChange(currentDate.getFullYear(), index)}
                  >
                    {monthName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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
            {['월', '화', '수', '목', '금', '토', '일'].map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="diary-calendar-days">
            {days.map((day, index) => (
              <div
                key={index}
                className={`diary-calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} 
                           ${day.hasEntry ? 'has-entry' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                {day.hasEntry ? (
                    day.emotion && (
                        <img
                          src={`http://localhost:8080/uploadFiles${day.emotion.emoji_image}`}
                          alt={day.emotion.name}
                          className="diary-emotion-indicator"
                          onError={(e) => {
                              console.error(`이미지 로드 실패: ${e.target.src}`);
                          }}
                        />
                    )
                ) : (
                    <span className="diary-day-number">{day.date.getDate()}</span>
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