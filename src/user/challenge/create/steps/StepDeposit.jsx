// src/challenge/create/steps/StepDeposit.jsx

import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import '../styles/ChallengeCreate.css'; // 공통 스타일 사용

export default function StepDeposit({ data, onNext, onBack }) {
  const [depositAmount, setDepositAmount] = useState(data.challengeDepositAmount || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(depositAmount);

    if (amount <= 0 || !Number.isInteger(amount)) {
      setError('보증금은 0보다 큰 정수만 입력할 수 있습니다.');
      return;
    }
    
    setError('');
    onNext({ challengeDepositAmount: amount });
  };

  return (
    <div className="challenge-create-container">
      <h2 className="challenge-create-title">챌린지 보증금 설정</h2>
      <p className="challenge-create-description">
        챌린지 참여에 필요한 보증금을 설정해주세요.
      </p>
      
      <form onSubmit={handleSubmit} className="challenge-create-form">
        <label htmlFor="deposit" className="form-label">
          보증금 (원)
        </label>
        <input
          id="deposit"
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="예: 10000"
          className="form-input"
        />
        {error && <p className="error-message">{error}</p>}
        
        <div className="button-group">
          <BackButton onBack={onBack} />
          <button type="submit" className="next-button">
            다음
          </button>
        </div>
      </form>
    </div>
  );
}