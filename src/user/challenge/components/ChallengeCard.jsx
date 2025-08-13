import '../styles/ChallengeCard.css';

export default function ChallengeCard({ challenge, onClick }) {
  const BACKEND_BASE_URL = "http://localhost:8080";

  const {
    challengeId,
    challengeTitle,
    challengeRecruitStartDate,
    challengeRecruitEndDate,
    challengeDurationDays,
    challengeMaxMembers,
    challengeParticipantCount = 0,
    challengeThumbnailPath,
    keywords = [],
  } = challenge || {};

  const imageUrl = challengeThumbnailPath
    ? `${BACKEND_BASE_URL}${challengeThumbnailPath}`
    : '/images/default-thumbnail.png';

  // 날짜 포맷
  const fmt = (d) => {
    if (!d) return '-';
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const da = String(dt.getDate()).padStart(2, '0');
    return `${y}.${m}.${da}`;
  };

  // 상태 계산
  const today = new Date();
  const recruitStart = new Date(challengeRecruitStartDate);
  const recruitEnd = new Date(challengeRecruitEndDate);

  let status = '모집 종료';
  if (today < recruitStart) status = '모집 예정';
  else if (today >= recruitStart && today <= recruitEnd) status = '모집 중';

  // D-Day (모집 중일 때만)
  const daysBetween = (a, b) => {
    const ONE = 24 * 60 * 60 * 1000;
    const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((db - da) / ONE);
  };
  const dday = status === '모집 중' ? Math.max(0, daysBetween(today, recruitEnd)) : null; // 당일은 D-0

  // 진행바
  const percent = Math.max(
    0,
    Math.min(100, challengeMaxMembers ? Math.round((challengeParticipantCount / challengeMaxMembers) * 100) : 0)
  );

return (
  <article
    className="challenge-card redesigned new-style" // 새로운 클래스 'new-style' 추가
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.(e)}
    aria-label={`${challengeTitle} 카드`}
  >
    <div className="card-image-wrapper">
      <div className="card-thumbnail" style={{ backgroundImage: `url(${imageUrl})` }}></div>
      <div className={`status-badge ${status === '모집 중' ? 'in-progress' : status === '모집 예정' ? 'upcoming' : 'closed'}`}>
        {status === '모집 중' ? `D-${dday}` : status}
      </div>
    </div>
    <div className="card-content">
      <h3 className="card-title">{challengeTitle}</h3>
      <div className="card-meta">
        <div className="meta-item">
          <span className="meta-label">Classes Type</span>
          <span className="meta-value">{keywords[0] || 'N/A'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Time</span>
          <span className="meta-value">{fmt(challengeRecruitStartDate)} ~ {fmt(challengeRecruitEndDate)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Participants</span>
          <span className="meta-value">{challengeParticipantCount}/{challengeMaxMembers}</span>
        </div>
      </div>
      <button className="book-now-button" style={{ backgroundColor: '#7c1d0d' }}>Book Now</button>
    </div>
  </article>
);
}