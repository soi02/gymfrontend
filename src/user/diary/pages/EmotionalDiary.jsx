// src/components/EmotionalDiary.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { diaryService } from '../service/diaryService';
import '../styles/EmotionalDiary.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const EmotionalDiary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, id } = useSelector(state => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [diaryContent, setDiaryContent] = useState('');
  const [emotions, setEmotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [textAlign, setTextAlign] = useState('left');
  const [isSaved, setIsSaved] = useState(false);
  const textareaRef = useRef(null);

  // OpenWeatherMap API 키 (사용자가 직접 발급받아 입력해야 함)
  const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/diary' } });
    }
  }, [isAuthenticated, navigate]);

  const fetchEmotions = async () => {
    try {
      const data = await diaryService.getEmojis();
      setEmotions(data);
    } catch (error) {
      setError('감정 목록을 불러오는데 실패했습니다.');
      console.error('감정 목록 조회 에러:', error);
    }
  };

  const getDiary = async (targetDate) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const diary = await diaryService.getDiaryByDate(id, targetDate);
      
      if (diary) {
        // 일기가 있는 경우
        const emotion = emotions.find(e => e.id === diary.emoji_id);
        setSelectedEmotion(emotion || null);
        setDiaryContent(diary.content || '');
        setShowModal(false);
        setIsSaved(true);
      } else {
        // 일기가 없는 경우 (정상적인 상황)
        setShowModal(true);
        setSelectedEmotion(null);
        setDiaryContent('');
        setIsSaved(false);
      }
    } catch (error) {
      // 실제 에러 상황만 에러 메시지 표시
      if (error.name !== 'NotFoundError') {
        console.error('일기 조회 중 예상치 못한 에러:', error);
        setError('일기를 불러오는 중 문제가 발생했습니다.');
      }
      // 에러 발생 시도 일기 작성 모달 표시
      setShowModal(true);
      setSelectedEmotion(null);
      setDiaryContent('');
      setIsSaved(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    setShowModal(false);
    setDiaryContent('');
  };

  const handleSave = async () => {
    if (!diaryContent.trim()) {
      alert('일기 내용을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const diaryData = {
        emoji_id: selectedEmotion.id,
        content: diaryContent
      };

      await diaryService.writeDiary(diaryData);
      alert('일기가 저장되었습니다.');
      setIsSaved(true);
    } catch (error) {
      setError('일기 저장에 실패했습니다.');
      console.error('일기 저장 에러:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationInsert = () => {
    if (isSaved) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        // Nominatim API를 사용한 역 지오코딩 (좌표 -> 주소)
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const address = data.display_name;
        if (address) {
          const locationText = `\n[위치: ${address}]\n`;
          setDiaryContent(prev => prev + locationText);
        } else {
          alert('현재 주소를 가져올 수 없습니다.');
        }
      } catch (error) {
        console.error("역 지오코딩 실패:", error);
        alert('위치 정보를 주소로 변환하는 데 실패했습니다.');
      }
    }, (error) => {
      console.error("Geolocation 에러:", error);
      alert('위치 정보 접근이 거부되었습니다. 브라우저 설정을 확인해주세요.');
    });
  };

  const handleWeatherInsert = () => {
    if (isSaved) return;

    if (WEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
        alert("날씨 정보를 가져오려면 OpenWeatherMap API 키가 필요합니다.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        // OpenWeatherMap API를 사용한 날씨 정보 조회
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`);
        const data = await response.json();
        if (data.weather && data.main) {
          const weatherDescription = data.weather[0].description;
          const temperature = data.main.temp;
          const weatherText = `\n[날씨: ${weatherDescription}, ${temperature.toFixed(1)}°C]\n`;
          setDiaryContent(prev => prev + weatherText);
        } else {
          alert('날씨 정보를 가져올 수 없습니다.');
        }
      } catch (error) {
        console.error("날씨 정보 조회 실패:", error);
        alert('날씨 정보를 가져오는 데 실패했습니다.');
      }
    }, (error) => {
      console.error("Geolocation 에러:", error);
      alert('날씨 정보를 가져오려면 위치 정보 접근이 필요합니다.');
    });
  };

  const handleTimeInsert = () => {
    if (!isSaved) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `\n${hours}:${minutes}\n`;
      setDiaryContent(prevContent => prevContent + currentTime);
    }
  };

  const handleAlignChange = (alignment) => {
    if (!isSaved) {
      setTextAlign(alignment);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [diaryContent]);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchEmotions();
    }
  }, [isAuthenticated, id]);

  useEffect(() => {
    if (isAuthenticated && id && emotions.length > 0) {
      const date = location.state?.selectedDate;
      getDiary(date);
    }
  }, [location.state, isAuthenticated, id, emotions]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!isAuthenticated) {
    return <div className="diary-loading">
      <div className="spinner-border text-warning" role="status">
        <span className="visually-hidden">로딩중...</span>
      </div>
    </div>;
  }

  return (
    <div className="emotional-diary">
      <div className="diary-header">
        <div className="diary-nav">
          <button className="diary-back-link" onClick={() => navigate(-1)}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="diary-calendar-link" onClick={() => navigate('/diary/calendar')}>
            <i className="bi bi-calendar3"></i>
            <span>캘린더 보기</span>
          </button>
        </div>
        <div className="diary-date">
          {location.state?.selectedDate ? new Date(location.state.selectedDate).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          }) : new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })}
        </div>
      </div>

      {error && (
        <div className="diary-error-message">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="diary-loading">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">로딩중...</span>
          </div>
        </div>
      ) : (
        <>
          {showModal && (
            <div className="diary-emotion-modal">
              <div className="diary-modal-content">
                <h2 className="diary-modal-title">오늘의 기분은 어떠셨나요?</h2>
                <div className="diary-emotions-grid">
                  {emotions.map((emotion) => (
                    <div
                      key={emotion.id}
                      className="diary-emotion-item"
                      onClick={() => handleEmotionSelect(emotion)}
                    >
                      <img src={`http://localhost:8080/uploadFiles${emotion.emoji_image}`} alt={emotion.name} />
                      <p>{emotion.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedEmotion && (
            <div className="diary-content-wrapper">
                <div className="diary-header-buttons">
                    <div className={`diary-title-container ${!isSaved ? 'clickable' : ''}`} 
                         onClick={() => !isSaved && setShowModal(true)}>
                        <h5 className="diary-content-title">
                            {isSaved ? "오늘의 일기" : "나의 기분"}
                        </h5>
                        <img className="diary-title-icon" 
                             src={`http://localhost:8080/uploadFiles${selectedEmotion.emoji_image}`} 
                             alt={selectedEmotion.name} 
                             title={isSaved ? selectedEmotion.name : "감정 선택하기"}
                        />
                    </div>
                    {!isSaved && (
                        <button 
                            className="diary-save-button" 
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            저장
                        </button>
                    )}
                </div>
                
                <p className="diary-content-subtitle">
                    {isSaved ? "오늘의 일기를 확인해보세요" : "오늘의 기분을 작성해주세요"}
                </p>

                <textarea
                    ref={textareaRef}
                    className="diary-input-textarea"
                    value={diaryContent}
                    onChange={(e) => setDiaryContent(e.target.value)}
                    placeholder="오늘 하루는 어떠셨나요? 자유롭게 작성해주세요."
                    disabled={isLoading || isSaved}
                    style={{ textAlign: textAlign }}
                />

                {!isSaved && (
                    <div className="diary-toolbar">
                        <div className="diary-env-icons">
                            <div className="diary-env-icon-wrapper" onClick={handleLocationInsert}>
                                <i className="bi bi-geo-alt diary-env-icon"></i>
                                <span className="diary-env-label">위치</span>
                            </div>
                            <div className="diary-env-icon-wrapper" onClick={handleWeatherInsert}>
                                <i className="bi bi-cloud-lightning-rain diary-env-icon"></i>
                                <span className="diary-env-label">날씨</span>
                            </div>
                            <div className="diary-env-icon-wrapper" onClick={handleTimeInsert}>
                                <i className="bi bi-clock diary-env-icon"></i>
                                <span className="diary-env-label">시간</span>
                            </div>
                        </div>
                        <div className="diary-text-options">
                            <div className="diary-align-icons">
                                <div className="diary-align-icon-wrapper" onClick={() => handleAlignChange('left')}>
                                    <i className="bi bi-text-left diary-align-icon"></i>
                                </div>
                                <div className="diary-align-icon-wrapper" onClick={() => handleAlignChange('center')}>
                                    <i className="bi bi-text-center diary-align-icon"></i>
                                </div>
                                <div className="diary-align-icon-wrapper" onClick={() => handleAlignChange('right')}>
                                    <i className="bi bi-text-right diary-align-icon"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmotionalDiary;