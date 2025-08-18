import { IoChevronForwardOutline, IoCalendarOutline, IoPeopleOutline } from "react-icons/io5";
import "../styles/ChallengeCard.apple.css";

const CAT_COLORS = {
  루틴:{ bg:"#6ea79c", bd:"#5b9489" }, 회복:{ bg:"#8fa4c1", bd:"#7890b0" },
  소통:{ bg:"#d77e88", bd:"#c36b76" }, 정보:{ bg:"#f2a766", bd:"#ac6324" },
  습관:{ bg:"#7c1d0d", bd:"#5e140a" }, 동기부여:{ bg:"#d89a00", bd:"#bb8600" },
  자기관리:{ bg:"#7c7e1f", bd:"#52530e" }, 분위기:{ bg:"#001439", bd:"#00102e" },
  전체:{ bg:"#a9adb3", bd:"#8e9399" },
};
const CAT_NAME_BY_ID = { 1:"루틴",2:"회복",3:"소통",4:"정보",5:"습관",6:"동기부여",7:"자기관리",8:"분위기" };

export default function ChallengeCard({ challenge, onClick }) {
  const BACKEND_BASE_URL = "http://localhost:8080";
  const {
    challengeTitle,
    challengeDescription, // challengeDescription 변수 추가
    challengeRecruitStartDate,
    challengeRecruitEndDate,
    challengeDurationDays,
    challengeMaxMembers,
    challengeParticipantCount = 0,
    challengeThumbnailPath,
    keywords = [],
    categoryId,
    categoryName,
  } = challenge || {};

  const imageUrl = challengeThumbnailPath
    ? `${BACKEND_BASE_URL}${challengeThumbnailPath}`
    : "/images/default-thumbnail.png";

  const fmt = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    return `${dt.getFullYear()}.${String(dt.getMonth()+1).padStart(2,"0")}.${String(dt.getDate()).padStart(2,"0")}`;
  };

  const cat = categoryName || CAT_NAME_BY_ID[categoryId] || "전체";
  const colors = CAT_COLORS[cat] || CAT_COLORS["전체"];

  const calcDday = () => {
    if (!challengeRecruitStartDate) return null;
    const today = new Date();
    const start = new Date(challengeRecruitStartDate);
    const diff = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "D-DAY";
    return null;
  };
  const dday = calcDday();

  const styleVars = {
    "--amc-start": colors.bg,
    "--amc-end": colors.bd,
    "--amc-cover": `url("${imageUrl}")`,
  };

  return (
    <article
      className="amc-card"
      style={styleVars}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e)=> (e.key==="Enter"||e.key===" ") && onClick?.(e)}
      aria-label={`${challengeTitle} 카드`}
    >
      {/* 배경(커버 + 그라디언트 틴트) */}
      <div className="amc-media" />
      <div className="amc-tint" />
      {dday && <span className="amc-chip amc-dday-chip">{dday}</span>} {/* D-day 뱃지 클래스 추가 */}
      {challengeDurationDays && <span className="amc-chip amc-duration-chip">{challengeDurationDays}일 수련</span>} {/* 기간 뱃지 추가 */}

      {/* 본문 텍스트 */}
      <div className="amc-content">
        <div className="amc-text-group">
          <div className="amc-keyword-list">
            {keywords.map((keyword, index) => (
              <p key={index} className="amc-keyword-tag">#{keyword}</p>
            ))}
          </div>
          <h3 className="amc-title">{challengeTitle}</h3>
          {challengeDescription && <p className="amc-intro">{challengeDescription}</p>}
        </div>

        {/* 하단 정보 바 */}
        <div className="amc-bottom">
          <div className="amc-meta">
            <span className="amc-meta-item">
              <IoCalendarOutline className="amc-ico" />
              {fmt(challengeRecruitStartDate)} ~ {fmt(challengeRecruitEndDate)}
            </span>
            <span className="amc-sep">·</span>
            <span className="amc-meta-item">
              <IoPeopleOutline className="amc-ico" />
              {challengeParticipantCount}/{challengeMaxMembers}
            </span>
          </div>
          <div className="amc-action">
            <button className="amc-btn">
              도전하기
              <IoChevronForwardOutline className="amc-btn-ico" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}