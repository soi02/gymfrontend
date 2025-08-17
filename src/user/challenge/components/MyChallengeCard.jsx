import React, { useMemo } from 'react';
import '../styles/MyChallengeCard.css';

const BACKEND_BASE_URL = 'http://localhost:8080';

const MyChallengeCard = ({ challenge, onClick, onAttendClick }) => {
  const {
    challengeId,
    challengeTitle,
    challengeThumbnailPath,
    challengeDurationDays,
    daysAttended,
    todayAttended,
  } = challenge || {};

  const fullImageUrl = useMemo(() => {
    if (!challengeThumbnailPath) return '/images/default-thumbnail.png';
    const isAbs = /^https?:\/\//i.test(challengeThumbnailPath);
    return isAbs ? challengeThumbnailPath : `${BACKEND_BASE_URL}${challengeThumbnailPath}`;
  }, [challengeThumbnailPath]);

  const dur = Number(challengeDurationDays) || 0;
  const done = Number(daysAttended) || 0;

  const progressPct = useMemo(() => {
    if (dur <= 0) return 0;
    const v = Math.round((done / dur) * 100);
    return Math.min(100, Math.max(0, v));
  }, [done, dur]);

  const handleAttend = (e) => {
    e.stopPropagation();
    onAttendClick && onAttendClick();
  };

  return (
    <article className="my-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="my-card-inner">
        {/* 썸네일 */}
        <div className="my-card-thumb">
          <img src={fullImageUrl} alt={challengeTitle} />
        </div>
        
        {/* 본문 */}
        <div className="my-card-content">
          <div className="my-card-header">
            <h3 className="my-card-title">{challengeTitle || '제목 없음'}</h3>
          </div>
          <div className="my-card-meta">
            <span className="my-meta-text">
              <span className="my-meta-label">출석:</span>
              <span className="my-meta-value">{done}</span>
              <span className="my-meta-total">/{dur || '-'}일</span>
            </span>
            <div className="my-card-progress-bar">
              <div className="my-progress" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* 액션 버튼 (오른쪽 상단) */}
      <div className="my-card-actions">
        <button
          className={`my-action-btn ${todayAttended ? 'done' : 'todo'}`}
          onClick={handleAttend}
        >
          {todayAttended ? '완료' : '인증'}
        </button>
      </div>
    </article>
  );
};

export default MyChallengeCard;