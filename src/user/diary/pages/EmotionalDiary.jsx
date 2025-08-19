import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmotionalDiary.css';
// Bootstrap icons
import 'bootstrap-icons/font/bootstrap-icons.css';

const emotions = [
  { id: 1, emoji: '😊', name: '행복', image: 'https://via.placeholder.com/60?text=Happy' },
  { id: 2, emoji: '😢', name: '슬픔', image: 'https://via.placeholder.com/60?text=Sad' },
  { id: 3, emoji: '😡', name: '화남', image: 'https://via.placeholder.com/60?text=Angry' },
  { id: 4, emoji: '😌', name: '평온', image: 'https://via.placeholder.com/60?text=Calm' },
  { id: 5, emoji: '🤔', name: '고민', image: 'https://via.placeholder.com/60?text=Worried' },
  { id: 6, emoji: '😴', name: '피곤', image: 'https://via.placeholder.com/60?text=Tired' }
];

const EmotionalDiary = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [diaryContent, setDiaryContent] = useState('');

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    setShowModal(false);
  };

  const handleSave = () => {
    // TODO: 일기 저장 로직 구현
    if (!diaryContent.trim()) {
      alert('일기 내용을 입력해주세요.');
      return;
    }
    
    const diaryData = {
      emotion: selectedEmotion,
      content: diaryContent,
      date: new Date().toISOString()
    };
    
    console.log('저장된 일기:', diaryData);
    // API 호출 또는 저장 로직 추가
    alert('일기가 저장되었습니다.');
  };

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
      </div>

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
                  <img src={emotion.image} alt={emotion.name} />
                  <p>{emotion.emoji} {emotion.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedEmotion && (
        <div className="diary-content-wrapper">
          <div className="diary-selected-emotion">
            <img src={selectedEmotion.image} alt={selectedEmotion.name} />
            <p>{selectedEmotion.emoji} {selectedEmotion.name}</p>
          </div>
          
          <textarea
            className="diary-input-textarea"
            value={diaryContent}
            onChange={(e) => setDiaryContent(e.target.value)}
            placeholder="오늘 하루는 어떠셨나요? 자유롭게 작성해주세요."
          />
          
          <button className="diary-button diary-save-button" onClick={handleSave}>
            저장하기
          </button>
        </div>
      )}
    </div>
  );
};

export default EmotionalDiary;
