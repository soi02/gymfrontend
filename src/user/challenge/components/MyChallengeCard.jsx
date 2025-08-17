import React, { useMemo } from 'react';
import '../styles/MyChallengeCard.css';

const BACKEND_BASE_URL = 'http://localhost:8080';

const palette = [
  '#FFE9B2', // 부드러운 옐로우
  '#E9E1FF', // 라일락
  '#D7F2FF', // 하늘
  '#FFE2E2', // 연핑크
  '#E4F8D2', // 민트그린
  '#FFEBDD', // 살구
];

function softColorFromKey(key = '') {
  try {
    const s = String(key);
    let hash = 0;
    for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    return palette[hash % palette.length];
  } catch {
    return palette[0];
  }
}

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

  const startStr = useMemo(() => {
    if (!personalJoinDate) return '-';
    const d = new Date(personalJoinDate);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }, [personalJoinDate]);

  const endInfo = useMemo(() => {
    if (!personalJoinDate || dur <= 0) return { endDateStr: '-', left: null };
    const start = new Date(personalJoinDate);
    const end = new Date(start);
    end.setDate(end.getDate() + dur - 1);
    const now = new Date();
    const left = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const endDateStr = `${end.getFullYear()}.${String(end.getMonth() + 1).padStart(2, '0')}.${String(end.getDate()).padStart(2, '0')}`;
    return { endDateStr, left };
  }, [personalJoinDate, dur]);

  const bg = softColorFromKey(challengeTitle ?? challengeId);

  const handleAttend = (e) => {
    e.stopPropagation();
    onAttendClick && onAttendClick();
  };

  return (
    <article
      className="mc2-card"
      style={{ background: bg }}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* 왼쪽 텍스트 영역 */}
      <div className="mc2-left">
        {/* ⬅️ 제목과 칩을 같은 줄에 배치하기 위한 컨테이너 */}
        <div className="mc2-title-and-chip">
          <h3 className="mc2-title">{challengeTitle || '제목 없음'}</h3>
          <span className={`mc2-chip ${todayAttended ? 'done' : 'todo'}`}>
            {todayAttended ? '오늘 인증 완료' : '오늘 인증'}
          </span>
        </div>

        <div className="mc2-progress">
          <div className="mc2-progress-track">
            <div className="mc2-progress-bar" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="mc2-progress-num">{progressPct}%</span>
        </div>

        <div className="mc2-meta">
          <span className="i">
            <em>출석</em>
            <strong>{done}</strong>/<span>{dur || '-'}</span>
          </span>
          <span className="dot">•</span>
          <span className="i">
            <em>기간</em>
            <span>{startStr}</span>
            <span className="dash">—</span>
            <span>{endInfo.endDateStr}</span>
          </span>
          <span className="dot">•</span>
          <span className="i">
            <em>남은</em>
            <span>{Number.isInteger(endInfo.left) ? `D-${endInfo.left}` : '-'}</span>
          </span>
        </div>

        <div className="mc2-actions">
          <button
            className={`mc2-btn ${todayAttended ? 'ghost' : 'primary'}`}
            onClick={handleAttend}
          >
            {todayAttended ? '인증 완료' : '오늘 인증'}
          </button>

          <span className="mc2-link">
            상세 보기
            <svg className="mc2-chev" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* 오른쪽 썸네일 (원형/부유) */}
      {/* <div className="mc2-thumb-wrap" aria-hidden="true">
        <div className="mc2-thumb-ring" />
        <div className="mc2-thumb">
          <img src={fullImageUrl} alt="" />
        </div>
      </div> */}
    </article>
  );
};

export default MyChallengeCard;
