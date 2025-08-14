import '../styles/ChallengeCard.css';

export default function ChallengeCard({ challenge, onClick }) {
  const BACKEND_BASE_URL = "http://localhost:8080";

  const {
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

  const fmt = (d) => {
    if (!d) return '-';
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return `${dt.getFullYear()}.${String(dt.getMonth()+1).padStart(2,'0')}.${String(dt.getDate()).padStart(2,'0')}`;
  };

  const eyebrow = Array.isArray(keywords) && keywords.length ? keywords[0] : 'Challenge';

  // ✅ D-Day 계산
  const calcDday = () => {
    if (!challengeRecruitStartDate) return null;
    const today = new Date();
    const startDate = new Date(challengeRecruitStartDate);
    const diffTime = startDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `D-${diffDays}`;
    if (diffDays === 0) return 'D-DAY';
    return null; // 시작일이 지났으면 안 표시
  };

  const dday = calcDday();

  return (
    <article
      className="challenge-card apple-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.(e)}
      aria-label={`${challengeTitle} 카드`}
    >
      {/* 상단 이미지 */}
      <div className="apple-thumb-wrapper">
        <img className="apple-thumb" src={imageUrl} alt="" loading="lazy" />
        {dday && <span className="dday-badge">{dday}</span>}
      </div>

      {/* 본문 */}
      <div className="apple-body">
        <h3 className="apple-title">{challengeTitle}</h3>
        <p className="apple-sub">
          {fmt(challengeRecruitStartDate)} ~ {fmt(challengeRecruitEndDate)}
          {challengeDurationDays ? ` · ${challengeDurationDays}일 과정` : ''}
          {challengeMaxMembers ? ` · ${challengeParticipantCount}/${challengeMaxMembers}명` : ''}
        </p>
      </div>
    </article>
  );
}
