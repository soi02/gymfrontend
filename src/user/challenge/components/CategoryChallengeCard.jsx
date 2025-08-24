// src/user/challenge/components/CategoryChallengeCard.jsx
import { IoChevronForwardOutline, IoCalendarOutline, IoPeopleOutline } from 'react-icons/io5';

const BACKEND_BASE_URL = 'http://localhost:8080';

function toAbsUrl(p) {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  return `${BACKEND_BASE_URL}${p}`;
}
function fmt(d) {
  if (!d) return '-';
  const dt = new Date(d);
  if (Number.isNaN(dt)) return d;
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`;
}
function dday(start) {
  if (!start) return null;
  const today = new Date();
  const s = new Date(start);
  const diff = Math.ceil((s - today) / 86400000);
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return 'D-DAY';
  return null;
}

export default function CategoryChallengeCard({ challenge, onClick }) {
  const {
    challengeTitle,
    challengeDescription,
    challengeRecruitStartDate,
    challengeRecruitEndDate,
    challengeDurationDays,
    challengeMaxMembers,
    challengeParticipantCount = 0,
    challengeThumbnailPath,
    keywords = [],
  } = challenge || {};

  const cover = toAbsUrl(challengeThumbnailPath);
  const chip = dday(challengeRecruitStartDate);

  return (
    <article className="cc-card" role="button" tabIndex={0}
      onClick={onClick}
      onKeyDown={(e)=> (e.key==='Enter' || e.key===' ') && onClick?.(e)}
      aria-label={`${challengeTitle} 카드`}>
      <div className="cc-thumb">
        {cover ? <img src={cover} alt="" /> : <div className="cc-thumb-fallback">NO IMAGE</div>}
        {chip && <span className="cc-badge cc-badge-dday">{chip}</span>}
        {challengeDurationDays && <span className="cc-badge cc-badge-duration">{challengeDurationDays}일 수련</span>}
      </div>

      <div className="cc-body">
        <h3 className="cc-title">{challengeTitle}</h3>

        {challengeDescription && (
          <p className="cc-intro">{challengeDescription}</p>
        )}

        {!!keywords.length && (
          <div className="cc-tags">
            {keywords.slice(0, 3).map((k, i) => (
              <span key={i} className="cc-tag">#{k}</span>
            ))}
          </div>
        )}

        {/* 🔽 여기부터 교체 */}
        <div className="cc-date">
          <IoCalendarOutline className="cc-ico" />
          <span className="cc-date-text">
            {fmt(challengeRecruitStartDate)} ~ {fmt(challengeRecruitEndDate)}
          </span>
        </div>

        <div className="cc-submeta">
          <span className="cc-meta-item">
            <IoPeopleOutline className="cc-ico" />
            {challengeParticipantCount}/{challengeMaxMembers}
          </span>
        </div>
      </div>

      {/* <div className="cc-cta">
        <IoChevronForwardOutline className="cc-cta-ico" />
      </div> */}
    </article>
  );
}
