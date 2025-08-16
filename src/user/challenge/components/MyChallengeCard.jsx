// src/components/MyChallengeCard.jsx
import React, { useMemo } from 'react';
import '../styles/MyChallengeCard.css';

const BACKEND_BASE_URL = 'http://localhost:8080';

const MyChallengeCard = ({ challenge, onClick, onAttendClick }) => {
  const {
    challengeId,
    challengeTitle,
    challengeThumbnailPath,
    challengeDurationDays,
    personalJoinDate,
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

  const daysPassed = useMemo(() => {
    if (!personalJoinDate) return null;
    const start = new Date(personalJoinDate);
    const now = new Date();
    const d = Math.ceil((now.getTime() - start.getTime()) / (1000*60*60*24));
    return d > 0 ? d : 0;
  }, [personalJoinDate]);

  // 종료일/남은일수
  const endInfo = useMemo(() => {
    if (!personalJoinDate || dur <= 0) return { endDateStr: '-', left: null };
    const start = new Date(personalJoinDate);
    const end = new Date(start);
    end.setDate(end.getDate() + dur - 1);
    const now = new Date();
    const left = Math.ceil((end.getTime() - now.getTime())/(1000*60*60*24));
    const endDateStr = `${end.getFullYear()}.${String(end.getMonth()+1).padStart(2,'0')}.${String(end.getDate()).padStart(2,'0')}`;
    return { endDateStr, left };
  }, [personalJoinDate, dur]);

  const startStr = useMemo(() => {
    if (!personalJoinDate) return '-';
    const d = new Date(personalJoinDate);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  }, [personalJoinDate]);

  return (
    <article className="my-card t" onClick={onClick} role="button" tabIndex={0}>
      <div className="my-card-thumb">
        <img src={fullImageUrl} alt={challengeTitle || 'challenge thumbnail'} />
      </div>

      <div className="my-card-body">
        <div className="my-card-row">
          <h3 className="my-card-title">{challengeTitle || '제목 없음'}</h3>
          <div className={`my-chip ${todayAttended ? 'done' : 'todo'}`}>
            {todayAttended ? '오늘 인증 완료' : '오늘 인증하기'}
          </div>
        </div>

        <div className="my-meta-grid">
          <div className="my-meta">
            <span className="k">기간</span>
            <span className="v">{dur > 0 ? `${dur}일` : '-'}</span>
          </div>
          <div className="my-meta">
            <span className="k">진행</span>
            <span className="v">{progressPct}%</span>
          </div>
          <div className="my-meta">
            <span className="k">출석</span>
            <span className="v">{done}/{dur > 0 ? dur : '-'}</span>
          </div>
          <div className="my-meta">
            <span className="k">시작</span>
            <span className="v">{startStr}</span>
          </div>
          <div className="my-meta">
            <span className="k">종료</span>
            <span className="v">{endInfo.endDateStr}</span>
          </div>
          <div className="my-meta">
            <span className="k">남은</span>
            <span className="v">{Number.isInteger(endInfo.left) ? `D-${endInfo.left}` : '-'}</span>
          </div>
        </div>

        <div className="my-card-progress t">
          <div className="my-card-progress-bar" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="my-card-actions">
          <button
            className={`t-btn ${todayAttended ? 'ghost' : 'primary'}`}
            onClick={onAttendClick}
            aria-label={todayAttended ? '오늘 인증 완료' : '오늘 인증하기'}
          >
            {todayAttended ? '인증 완료' : '오늘 인증'}
          </button>

          <span className="t-link">
            상세 보기
            <svg width="16" height="16" viewBox="0 0 24 24" className="chev">
              <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};

export default MyChallengeCard;
