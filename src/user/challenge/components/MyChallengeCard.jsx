import React from 'react';
import '../styles/MyChallengeCard.css'; 

// 백엔드 기본 URL을 MyChallengeCard 컴포넌트에서도 사용
const BACKEND_BASE_URL = "http://localhost:8080"; 

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

  // 이미지 경로를 백엔드 URL과 결합하여 완전한 URL로 만듭니다.
  const fullImageUrl = `${BACKEND_BASE_URL}${challengeThumbnailPath}`;

  // 챌린지 진행률 계산
  const progressPercentage = (daysAttended / challengeDurationDays) * 100;
  
  // 챌린지 시작일로부터 현재까지 경과한 날짜 계산
  const startDate = new Date(personalJoinDate);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - startDate.getTime();
  const daysPassed = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // 밀리초를 일자로 변환

  return (
    <div className="my-challenge-card" onClick={onClick}>
      <img src={fullImageUrl} alt={challengeTitle} className="challenge-thumbnail" />
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