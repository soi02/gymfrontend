import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmotionalDiary.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const emotions = [
  { id: 1, name: '행복', image: 'https://via.placeholder.com/60?text=Happy', color: '#ffec5e' },
  { id: 2, name: '슬픔', image: 'https://via.placeholder.com/60?text=Sad', color: '#68a0d9' },
  { id: 3, name: '화남', image: 'https://via.placeholder.com/60?text=Angry', color: '#e74c3c' },
  { id: 4, name: '평온', image: 'https://via.placeholder.com/60?text=Calm', color: '#2ecc71' },
  { id: 5, name: '고민', image: 'https://via.placeholder.com/60?text=Worried', color: '#f39c12' },
  { id: 6, name: '피곤', image: 'https://via.placeholder.com/60?text=Tired', color: '#95a5a6' }
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
    if (!diaryContent.trim()) {
      alert('일기 내용을 입력해주세요.');
      return;
    }
    
    const diaryData = {
      emotion: selectedEmotion.name,
      content: diaryContent,
      date: new Date().toISOString()
    };
    
    console.log('저장된 일기:', diaryData);
    alert('일기가 성공적으로 저장되었습니다!');
    // 저장 후 페이지 이동 또는 초기화
    // navigate('/diary/calendar');
  };

  return (
    <div className="emotional-diary-container">
      <div className="diary-header">
        <button className="diary-icon-btn" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <button className="diary-icon-btn calendar-btn" onClick={() => navigate('/diary/calendar')}>
          <i className="bi bi-calendar3"></i>
        </button>
      </div>

      {showModal && (
        <div className="diary-modal-backdrop">
          <div className="diary-modal-content">
            <h2 className="diary-modal-title">오늘 하루는 어떠셨나요?</h2>
            <div className="diary-emotions-grid">
              {emotions.map((emotion) => (
                <div
                  key={emotion.id}
                  className="emotion-card"
                  onClick={() => handleEmotionSelect(emotion)}
                >
                  <img src={emotion.image} alt={emotion.name} className="emotion-image" />
                  <span className="emotion-name">{emotion.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedEmotion && (
        <div className="diary-main-content">
          <div className="emotion-display">
            <div
              className="emotion-circle"
              style={{ backgroundColor: selectedEmotion.color }}
              onClick={() => setShowModal(true)} // 이모지 클릭 시 모달 다시 열기
            >
              <img src={selectedEmotion.image} alt={selectedEmotion.name} className="emotion-image-large" />
            </div>
            {/* <h3 className="emotion-title">오늘의 기분은 **{selectedEmotion.name}**입니다.</h3> */}
          </div>
          
          <textarea
            className="diary-textarea"
            value={diaryContent}
            onChange={(e) => setDiaryContent(e.target.value)}
            placeholder="오늘 하루를 기록해보세요."
          />
          
          <button className="diary-save-btn" onClick={handleSave}>
            저장하기
          </button>
        </div>
      )}
    </div>
  );
};

export default EmotionalDiary;