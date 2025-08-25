import React, { useState } from 'react';
import '../styles/ChallengeCreate.css';
import StepLayout from './StepLayout';

export default function StepDeposit({ data, onNext, onBack }) {
  const [depositAmount, setDepositAmount] = useState(data.challengeDepositAmount || '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const amount = Number(depositAmount);

    if (amount <= 0 || !Number.isInteger(amount)) {
      setError('보증금은 0보다 큰 정수만 입력할 수 있습니다.');
      return;
    }
    
    setError('');
    onNext({ challengeDepositAmount: amount });
  };

  return (
    <StepLayout
      onBack={onBack}
      onNext={handleSubmit}
      question='<span class="highlight">보증금을<br />설정해주시오.</span>'
      subText="수련에 참여할 자들이 내야 할<br />보증금을 정하여 주시오."
      nextButtonText="다음"
      isNextButtonDisabled={depositAmount === '' || error !== ''}
    >
<div className="form-group field-money">
  <label htmlFor="deposit" className="form-label">
    보증금 (원)
  </label>
  <div className="money-input-wrapper">
    <input
      id="deposit"
      type="number"
      value={depositAmount}
      onChange={(e) => setDepositAmount(e.target.value)}
      placeholder="예: 3000"
      className="form-input form-input-money"
    />
    <span className="money-suffix">원</span>
  </div>
  {error && <p className="error-message">{error}</p>}
</div>


<p className="deposit-help">
  ※ 수련 성공 시 <strong>100% 환불</strong>받을 수 있으며,<br />
  실패 시 50%는 대한장애인체육회에 기부될 것이오.
</p>

    </StepLayout>
  );
}