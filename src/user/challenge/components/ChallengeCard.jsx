import { IoChevronForwardOutline, IoCalendarOutline, IoPeopleOutline } from "react-icons/io5";
import "../styles/ChallengeCard.css";

const CAT_COLORS = {
  "루틴":      { bg: "#6ea79c", bd: "#5b9489" },
  "회복":      { bg: "#8fa4c1", bd: "#7890b0" },
  "소통":      { bg: "#d77e88", bd: "#c36b76" },
  "정보":      { bg: "#f2a766", bd: "#ac6324" },
  "습관":      { bg: "#7c1d0d", bd: "#5e140a" },
  "동기부여":  { bg: "#d89a00", bd: "#bb8600" },
  "자기관리":  { bg: "#7c7e1f", bd: "#52530e" },
  "분위기":    { bg: "#001439", bd: "#00102e" },
  "전체":      { bg: "#a9adb3", bd: "#8e9399" },
};

const CAT_NAME_BY_ID = {
  1: "루틴", 2: "회복", 3: "소통", 4: "정보",
  5: "습관", 6: "동기부여", 7: "자기관리", 8: "분위기",
};

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

  // 선택: D-Day
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

  // 카드에 색 변수 주입(적용 안 되는 문제 방지: 인라인 CSS 변수로 확실히 반영)
  const styleVars = { "--cat-bg": colors.bg, "--cat-bg-d": colors.bd };

  return (
    <article
      className="challenge-card apple-card color-skin"
      style={styleVars}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.(e)}
      aria-label={`${challengeTitle} 카드`}
    >


      {/* 상단 이미지 */}
<div className="apple-thumb-wrapper">
  <img className="apple-thumb" src={imageUrl} alt="" loading="lazy" />

  {/* 왼쪽 상단 기간 뱃지 */}
  {challengeDurationDays && (
    <span className="duration-badge">{challengeDurationDays}일 수련</span>
  )}

  {/* 오른쪽 상단 D-Day 뱃지 */}
  {dday && <span className="dday-badge">{dday}</span>}
</div>


      {/* 본문 */}
      <div className="apple-body">
        <div className="apple-body-top">
          <div className="apple-text">


            <h3 className="apple-title">{challengeTitle}</h3>

            {/* 해시태그 칩 */}
            {keywords?.length > 0 && (
              <div className="apple-keywords">
                {keywords.map((kw, i) => (
                  <span key={i} className="apple-keyword">#{kw}</span>
                ))}
              </div>
            )}

            {/* 메타 정보 (달력, 인원) */}
            <div className="meta-row">
              <div className="meta-item">
                <IoCalendarOutline className="meta-ic" />
                <span className="meta-txt">
                  {fmt(challengeRecruitStartDate)} ~ {fmt(challengeRecruitEndDate)}
                  {/* {challengeDurationDays ? ` · ${challengeDurationDays}일 수련` : ""} */}
                </span>
              </div>
              {challengeMaxMembers ? (
                <div className="meta-item">
                  <IoPeopleOutline className="meta-ic" />
                  <span className="meta-txt">
                    {challengeParticipantCount}/{challengeMaxMembers}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* iOS 체브론 */}
          <IoChevronForwardOutline className="apple-chevron" />
        </div>
      </div>
    </article>
  );
}
