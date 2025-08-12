import React, { useState } from 'react';
import '../styles/ChallengeCreate.css';
import StepLayout from './StepLayout';

export default function StepDurationDate({ onNext, onBack }) {
  const [selectedDays, setSelectedDays] = useState(14);
  const options = [7, 14, 21, 30];

  const handleNext = () => {
    onNext({ challengeDurationDays: selectedDays });
  };

  return (
    <StepLayout
      onBack={onBack}
      onNext={handleNext}
      question='<span class="highlight">수련 진행 기간을<br />선택해주시오.</span>'
      subText="도전 시작을 누른 후, 이 기간만큼<br />수련을 이어나가게 될 것이오."
      nextButtonText="다음"
      isNextButtonDisabled={false}
    >
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
    </StepLayout>
  );
}