import React, { useState } from 'react';
import '../styles/ChallengeCreate.css';

export default function StepCapacity({ onNext, onBack }) {
  const [capacity, setCapacity] = useState(40); // 기본값 40명

  const handleSliderChange = (e) => {
    setCapacity(parseInt(e.target.value, 10));
  };

  const handleNext = () => {
    onNext({ challengeMaxMembers: capacity }); // onNext 활용해서 인원수를 폼데이터에 전달
  };

  return (
    <div className="challenge-create-page">
      <button className="back-button" onClick={onBack}>←</button>

      <h3 className="challenge-step-title">챌린지 만들기</h3>

      <h2 className="challenge-step-question">
        <span className="highlight">함께 할 최대 인원을 정해요.</span>
      </h2>
      <p className="challenge-step-sub">몇 명의 사람들과 함께 도전할지 알려주세요.</p>

      <div style={{ margin: '40px 0', textAlign: 'center' }}>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={capacity}
          onChange={handleSliderChange}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '14px', color: '#555' }}>
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: 8 }}>{capacity}</div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#666', marginBottom: 30 }}>
        ※ 참여 인원이 과반수 이상 모여야 챌린지가 시작돼요!
      </p>

      <button className="next-button" onClick={handleNext}>다음</button>
    </div>
  );
}
