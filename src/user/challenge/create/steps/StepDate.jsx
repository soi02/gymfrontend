import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { ko } from 'date-fns/locale';
import { differenceInDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../styles/ChallengeCreate.css';

export default function StepDate({ onNext, onBack }) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const challengeStartDate = range[0].startDate;
  const challengeEndDate = range[0].endDate;
  const totalDays = differenceInDays(challengeEndDate, challengeStartDate) + 1; // 당일 포함 계산

const handleNext = () => {
  onNext({
    challengeStartDate: challengeStartDate.toISOString().split('T')[0],  // "2025-07-30"
    challengeEndDate: challengeEndDate.toISOString().split('T')[0],
  });
};



  return (
    <div className="challenge-create-page">
      <button className="back-button" onClick={onBack}>←</button>

      <h3 className="challenge-step-title">챌린지 만들기</h3>
      <h2 className="challenge-step-question">
        <span className="highlight">기간을 알려주시겠어요?</span>
      </h2>
      <p className="challenge-step-sub">얼마 동안 도전할지<br />기간을 선택해주세요</p>

      <div style={{ marginTop: 20 }}>
        <DateRange
          editableDateInputs={true}
          onChange={item => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={range}
          locale={ko}
          showMonthAndYearPickers={true}
          minDate={new Date()}
        />
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#333', marginTop: 16 }}>
        선택한 기간은 <strong>{totalDays}일</strong>입니다.
      </p>

      <button className="next-button" onClick={handleNext}>다음</button>
    </div>
  );
}
