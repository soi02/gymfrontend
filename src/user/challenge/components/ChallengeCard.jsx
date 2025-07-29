import '../styles/ChallengeCard.css';

export default function ChallengeCard({ challenge }) {
    console.log("챌린지 데이터:", challenge); // ✅ 여기에 찍기
  const {
    challengeId,
    challengeTitle,
    challengeStartDate,
    challengeEndDate,
    challengeMaxMembers,
    currentMembers = 0,
    challengeThumbnailPath,
    keywords = [], // 키워드 리스트도 추가되어 있다고 가정
  } = challenge;

  // 진행 상태 판단 로직
  const today = new Date();
  const start = new Date(challengeStartDate);
  const end = new Date(challengeEndDate);

  console.log("start:", start, "end:", end); // ✅ 여기도 추가

  let status = '모집 중';
  if (today >= start && today <= end) {
    status = '진행 중';
  } else if (today > end) {
    status = '종료';
  }

  return (
    <div className="challenge-card">
      <div className="challenge-card-thumbnail-container">
        <img
          src={challengeThumbnailPath || '/images/default-thumbnail.png'}
          alt="챌린지 썸네일"
          className="challenge-card-thumbnail"
        />
        <span className="challenge-card-badge">챌린지 생성</span>
      </div>

      <div className="challenge-card-info">
        <div className="challenge-card-period-status">
          <span className="challenge-card-period">
            {challengeStartDate} ~ {challengeEndDate}
          </span>
          <span className="challenge-card-status">{status}</span>
        </div>

        <div className="challenge-card-title">{challengeTitle}</div>

        <div className="challenge-card-keywords">
          {keywords.map((kw, idx) => (
            <span key={idx} className="challenge-card-keyword">
              #{kw}
            </span>
          ))}
        </div>

        <div className="challenge-card-participants">
          {currentMembers}명 / {challengeMaxMembers}명
        </div>
      </div>
    </div>
  );
}
