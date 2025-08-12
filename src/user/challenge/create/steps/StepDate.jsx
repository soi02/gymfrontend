import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import { ko } from 'date-fns/locale';
import { differenceInDays, startOfDay } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../styles/ChallengeCreate.css';
import StepLayout from './StepLayout';

export default function StepDate({ onNext, onBack }) {
  const today = startOfDay(new Date());

  const [range, setRange] = useState([
    {
      startDate: today,
      endDate: today,
      key: 'selection'
    }
  ]);

  const challengeRecruitStartDate = range[0].startDate;
  const challengeRecruitEndDate = range[0].endDate;
  const totalRecruitDays =
    differenceInDays(challengeRecruitEndDate, challengeRecruitStartDate) + 1;

  const handleNext = () => {
    onNext({
      challengeRecruitStartDate: challengeRecruitStartDate.toISOString().split('T')[0],
      challengeRecruitEndDate: challengeRecruitEndDate.toISOString().split('T')[0],
    });
  };

  return (
    <StepLayout
      onBack={onBack}
      onNext={handleNext}
      question='<span class="highlight">수련원 모집 기간을<br />설정해주시오.</span>'
      subText="사용자들은 이 기간 동안 수련 접수가 가능하오."
      nextButtonText="다음"
      isNextButtonDisabled={false}
    >
      <div className="date-range-wrapper">
        <DateRange
          editableDateInputs={true}           // 인풋은 CSS로 숨김
          onChange={item => setRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={range}
          locale={ko}
          minDate={today}
          months={1}
          direction="horizontal"
          showDateDisplay={false}
          showSelectionPreview={false}
          weekdayDisplayFormat="EEEEE"        // 일~토 한 글자
          monthDisplayFormat="yyyy.MM"
          rangeColors={['#7c1d0d']}           // 포인트 컬러
          weekStartsOn={1}                    // 월요일 시작(원하면 0으로)
          fixedHeight={true}
        />
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.95rem', color: '#333'}}>
        선택한 모집 기간은 <strong>{totalRecruitDays}일</strong>입니다.
      </p>
    </StepLayout>
  );
}
