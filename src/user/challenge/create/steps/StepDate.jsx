// src/steps/StepDate.jsx

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

  // '접수 기간'을 위한 변수명으로 변경
  const challengeRecruitStartDate = range[0].startDate;
  const challengeRecruitEndDate = range[0].endDate;
  const totalRecruitDays = differenceInDays(challengeRecruitEndDate, challengeRecruitStartDate) + 1; // 당일 포함 계산

  const handleNext = () => {
    // onNext로 모집 기간 데이터를 전달
    onNext({
      challengeRecruitStartDate: challengeRecruitStartDate.toISOString().split('T')[0], // "2025-07-30"
      challengeRecruitEndDate: challengeRecruitEndDate.toISOString().split('T')[0],
    });
  };

  return (
    <div className="challenge-create-page">
      <button className="back-button" onClick={onBack}>←</button>

      <h3 className="challenge-step-title">챌린지 만들기</h3>
      <h2 className="challenge-step-question">
        <span className="highlight">참가자를 모집할 기간을 알려주시겠어요?</span> {/* 문구 변경 */}
      </h2>
      <p className="challenge-step-sub">사용자들이 챌린지에 참여 신청할 수 있는<br />기간을 선택해주세요.</p> {/* 문구 변경 */}

      <div style={{ marginTop: 20 }}>
        <DateRange
          editableDateInputs={true}
          onChange={item => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={range}
          locale={ko}
          showMonthAndYearPickers={true}
          minDate={new Date()} // 모집 기간은 오늘부터 시작 가능
        />
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#333', marginTop: 16 }}>
        선택한 모집 기간은 <strong>{totalRecruitDays}일</strong>입니다. {/* 문구 변경 */}
      </p>

      <button className="next-button" onClick={handleNext}>다음</button>
    </div>
  );
}