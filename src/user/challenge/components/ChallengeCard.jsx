import '../styles/ChallengeCard.css';

export default function ChallengeCard({ challenge, onClick }) {
    const BACKEND_BASE_URL = "http://localhost:8080"; 

    const {
        challengeId,
        challengeTitle,
        challengeStartDate,
        challengeEndDate,
        challengeDurationDays,
        challengeMaxMembers,
        currentMembers = 0,
        challengeThumbnailPath, // 이 값은 이미 "/challengeImages/2025/07/30/..." 형태임
        keywords = [],
    } = challenge;
    
    // challengeThumbnailPath 자체가 이미 `/challengeImages/`를 포함하고 있으므로,
    // BACKEND_BASE_URL만 앞에 붙여줍니다.
    const imageUrl = challengeThumbnailPath 
      ? `${BACKEND_BASE_URL}${challengeThumbnailPath}` // 여기를 수정!
      : '/images/default-thumbnail.png'; 

    const today = new Date();
    const start = new Date(challengeStartDate);
    const end = new Date(challengeEndDate);

    let status = '모집 중';
    if (today >= start && today <= end) {
        status = '진행 중';
    } else if (today > end) {
        status = '종료';
    }

    return (
        <div className="challenge-card" onClick={onClick}>
            <div className="challenge-card-thumbnail-container">
                <img
                    src={imageUrl} 
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
                <div className="challenge-card-duration">
                    기간: {challengeDurationDays}일
                </div>

                <div className="challenge-card-title">{challengeTitle}</div>

                <div className="challenge-card-keywords">
                    {keywords.map((kw) => (
                        <span key={kw} className="challenge-card-keyword">
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