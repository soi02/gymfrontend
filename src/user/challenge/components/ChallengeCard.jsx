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
      className="challenge-card redesigned clean"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.(e)}
      aria-label={`${challengeTitle} 카드`}
    >
      <div className="cc-thumb">
        <img src={imageUrl} alt={`${challengeTitle} 썸네일`} loading="lazy" />
        {/* 모집 중 → D-Day, 그 외 → 상태칩 */}
        {status === '모집 중' ? (
          <span className="cc-badge badge-dday">마감 D-{dday}</span>
        ) : (
          <span className={`cc-badge ${status === '모집 예정' ? 'badge-upcoming' : 'badge-closed'}`}>
            {status}
          </span>
        )}
        <span className="cc-pill">{challengeDurationDays ?? '-'}일 진행</span>
      </div>

      <div className="cc-body">
        <h3 className="cc-title" title={challengeTitle}>{challengeTitle}</h3>

        <div className="cc-dates" aria-label="모집 기간">
          <span className="cc-date">{fmt(challengeRecruitStartDate)} ~ {fmt(challengeRecruitEndDate)}</span>
        </div>

        {/* 항상 렌더링해서 영역 고정 */}
        <div className="cc-tags" aria-label="키워드">
          {keywords.slice(0, 6).map((kw, i) => (
            <span className="cc-tag" key={`${challengeId}-kw-${i}`}>#{kw}</span>
          ))}
          {keywords.length > 6 && <span className="cc-tag more">+{keywords.length - 6}</span>}
        </div>

        <div className="cc-meta">
          <div className="cc-progress">
            <div className="cc-progress-bar" style={{ width: `${percent}%` }} />
          </div>
          <div className="cc-count" aria-label="참여 인원">
            {challengeParticipantCount}명 / {challengeMaxMembers}명
          </div>
        </div>
      </div>
    </article>
  );
}