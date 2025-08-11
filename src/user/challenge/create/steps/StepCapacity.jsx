import React, { useState } from 'react';
import '../styles/ChallengeCreate.css';
import StepLayout from './StepLayout';

export default function StepCapacity({ onNext, onBack }) {
  const [capacity, setCapacity] = useState(40); // 기본값 40명

  const handleSliderChange = (e) => {
    setCapacity(parseInt(e.target.value, 10));
  };

  const handleNext = () => {
    onNext({ challengeMaxMembers: capacity });
  };

  return (
    <StepLayout
      onBack={onBack}
      onNext={handleNext}
      question='<span class="highlight">수련에 함께할 <br />최대 수련생 수를 정해주시오.</span>'
      subText="몇 명의 수련생과 함께 수련을 떠날지 알려주시오."
      nextButtonText="다음"
      isNextButtonDisabled={false}
    >
      <div style={{ margin: '40px 0', textAlign: 'center' }}>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={capacity}
          onChange={handleSliderChange}
          className="step-capacity-slider"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '14px', color: '#555' }}>
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
        <div className="step-capacity-value">{capacity}</div>
      </div>

      {/* <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#666', marginBottom: 30 }}>
        ※ 참여 인원이 과반수 이상 모여야 수련원이 시작되오.
      </p> */}
    </StepLayout>
  );
}