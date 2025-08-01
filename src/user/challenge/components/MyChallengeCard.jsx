import React from 'react';
import '../styles/MyChallengeCard.css'; // CSS 파일 (4번에서 만들 예정)

const MyChallengeCard = ({ challenge, onClick }) => {
  const {
    challengeId,
    challengeTitle,
    challengeThumbnailPath,
    challengeDurationDays,
    personalJoinDate,
    daysAttended,
    todayAttended
  } = challenge;

  // 챌린지 진행률 계산
  const progressPercentage = (daysAttended / challengeDurationDays) * 100;
  
  // 챌린지 시작일로부터 현재까지 경과한 날짜 계산
  const startDate = new Date(personalJoinDate);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - startDate.getTime();
  const daysPassed = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // 밀리초를 일자로 변환

  return (
    <div className="my-challenge-card" onClick={onClick}>
      <img src={challengeThumbnailPath} alt={challengeTitle} className="challenge-thumbnail" />
      <div className="card-content">
        <h3>{challengeTitle}</h3>
        <p>총 {challengeDurationDays}일 챌린지 ({daysPassed}일차 진행 중)</p>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p>출석: {daysAttended} / {challengeDurationDays}일</p>
        <div className={`status-badge ${todayAttended ? 'completed' : 'pending'}`}>
          {todayAttended ? '오늘 인증 완료 👍' : '오늘 인증하기 👀'}
        </div>
      </div>
    </div>
  ); 
};

export default MyChallengeCard;