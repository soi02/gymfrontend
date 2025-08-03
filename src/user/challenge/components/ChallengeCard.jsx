// src/components/ChallengeCard.jsx

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
    } = challenge;
    
    const imageUrl = challengeThumbnailPath 
      ? `${BACKEND_BASE_URL}${challengeThumbnailPath}` 
      : '/images/default-thumbnail.png'; 

    // --- 챌린지 상태 계산 로직 (모집 기간 기준) ---
    const today = new Date();
    const recruitStart = new Date(challengeRecruitStartDate);
    const recruitEnd = new Date(challengeRecruitEndDate);

    let status = ''; // 기본 상태 초기화
    if (today < recruitStart) {
        status = '모집 예정';
    } else if (today >= recruitStart && today <= recruitEnd) {
        status = '모집 중';
    } else { // today > recruitEnd (모집 기간이 지났을 경우)
        status = '모집 종료'; // 챌린지 모집이 끝났음을 나타냄
        // 챌린지가 실제로 '종료'되었는지 여부는 challengeDurationDays와는 별개로
        // 각 유저가 참여한 기간에 따라 달라지므로, 카드에서는 모집 상태만 보여주는 것이 명확합니다.
        // 또는 "모집 종료" 후 일정 기간이 지나면 "종료"로 표시하는 추가 로직을 고려할 수 있습니다.
    }

    return (
        <div className="challenge-card" onClick={onClick}>
            <div className="challenge-card-thumbnail-container">
                <img
                    src={imageUrl} 
                    alt="챌린지 썸네일"
                    className="challenge-card-thumbnail"
                />
                {/* 뱃지는 필요에 따라 '모집 중', '모집 예정', '모집 종료' 등으로 동적으로 변경 가능 */}
                <span className="challenge-card-badge">{status}</span> 
            </div>

            <div className="challenge-card-info">
                <div className="challenge-card-period-status">
                    <span className="challenge-card-period">
                        {/* 모집 기간을 표시 */}
                        모집 기간 {challengeRecruitStartDate} ~ {challengeRecruitEndDate}
                    </span>
                    {/* 상태는 이미 뱃지로 표시되었으므로 중복될 수 있습니다. 필요에 따라 조절 */}
                    {/* <span className="challenge-card-status">{status}</span> */}
                </div>
                <div className="challenge-card-duration">
                    진행 기간 {challengeDurationDays}일
                </div>

                <div className="challenge-card-title">{challengeTitle}</div>

                <div className="challenge-card-keywords">
                    {/* 키워드 배열이 있다면 map 함수 사용 */}
                    {keywords && keywords.map((kw, index) => (
                        <span key={index} className="challenge-card-keyword">
                            #{kw}
                        </span>
                    ))}
                </div>

                <div className="challenge-card-participants">
                    {challengeParticipantCount }명 / {challengeMaxMembers}명
                </div>
            </div>
        </div>
    );
}