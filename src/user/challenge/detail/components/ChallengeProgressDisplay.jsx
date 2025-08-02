// src/user/challenge/components/ChallengeProgressDisplay.jsx
import React from 'react';
import { format } from 'date-fns';
import '../styles/ChallengeProgressDisplay.css'; // 필요 시 CSS 파일 생성

// 상태에 따른 아이콘/이미지 (예시)
const statusIcons = {
  '인증완료': '✅', // 또는 이미지 URL
  '결석': '❌',
  '미래': '🗓️'
};

const ChallengeProgressDisplay = ({ statusList }) => {
  // statusList가 없거나 비어있는 경우
  if (!statusList || statusList.length === 0) {
    return <div>챌린지 진행 상황 정보가 없습니다.</div>;
  }

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    // 백엔드에서 LocalDate 형식으로 받으므로 Date 객체로 변환
    const d = new Date(date);
    return format(d, 'M/d'); // 예: 8/3
  };

  return (
    <div className="progress-display-container">
      <h3>진행 상황 (스티커판)</h3>
      <div className="progress-grid">
        {statusList.map((statusItem, index) => (
          <div key={index} className={`progress-item status-${statusItem.status}`}>
            <div className="item-date">{formatDate(statusItem.recordDate)}</div>
            <div className="item-content">
              {/* 상태에 따라 다른 UI 렌더링 */}
              {statusItem.status === '인증완료' && statusItem.photoUrl ? (
                <img 
                  src={statusItem.photoUrl} 
                  alt="인증 사진" 
                  className="attendance-photo"
                />
              ) : (
                <div className="status-icon">
                  {statusIcons[statusItem.status]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeProgressDisplay;