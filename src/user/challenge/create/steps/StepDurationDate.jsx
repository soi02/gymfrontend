// src/steps/StepDurationDate.jsx

import React, { useState } from 'react';
import '../styles/ChallengeCreate.css';

export default function StepDurationDate({ onNext, onBack }) {
  const [selectedDays, setSelectedDays] = useState(14); // 기본값 14일

  const handleNext = () => {
    // onNext로 진행 기간 데이터만 전달
    onNext({ challengeDurationDays: selectedDays });
  };

  const options = [7, 14, 21, 30]; // 선택 가능한 진행 기간 옵션

  return (
    <div className="challenge-create-page">
      <button className="back-button" onClick={onBack}>←</button>

      <h3 className="challenge-step-title">챌린지 만들기</h3>
      <h2 className="challenge-step-question">
        <span className="highlight">챌린지 '진행' 기간을 선택해주세요</span> {/* 문구 명확화 */}
      </h2>
      <p className="challenge-step-sub">사용자가 '도전 시작' 버튼을 누른 후<br />이 기간만큼 챌린지를 진행하게 돼요.</p> {/* 문구 명확화 */}

      <div className="step-duration-options">
        {options.map((days) => (
          <button
            key={days}
            className={`step-duration-button ${selectedDays === days ? 'selected' : ''}`}
            onClick={() => setSelectedDays(days)}
          >
            {days}일 챌린지
          </button>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#333', marginTop: 16 }}>
        선택한 진행 기간: <strong>{selectedDays}일</strong>
      </p>

      <button className="next-button" onClick={handleNext}>다음</button>
    </div>
  );
}