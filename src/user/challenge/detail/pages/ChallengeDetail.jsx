import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChallengeStartModal from '../components/ChallengeStartModal';
import '../styles/ChallengeDetail.css';

export default function ChallengeDetail() {
  const { challengeId } = useParams();
  console.log("URL에서 추출된 challengeId:", challengeId); 

  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const BACKEND_BASE_URL = "http://localhost:8080"; 

  useEffect(() => {
    axios.get(`${BACKEND_BASE_URL}/api/challengeList/getChallengeDetailByChallengeIdProcess?challengeId=${challengeId}`) 
      .then((res) => {
          console.log("챌린지 상세 데이터 수신:", res.data); // 성공 시 데이터 확인
          setChallenge(res.data);
      })
      .catch((err) => {
        console.error("챌린지 상세 실패", err);
        if (err.response) {
            console.error("오류 응답 데이터:", err.response.data);
            console.error("오류 상태 코드:", err.response.status);
            console.error("오류 헤더:", err.response.headers);
        } else if (err.request) {
            console.error("요청은 보냈으나 응답을 받지 못함 (네트워크 문제, CORS 등):", err.request);
        } else {
            console.error("요청 설정 중 문제 발생:", err.message);
        }
        alert("챌린지를 불러올 수 없습니다.");
        navigate(-1);
      });
  }, [challengeId, navigate]); // navigate를 의존성 배열에 추가

  if (!challenge) return <div>로딩 중...</div>;

  const {
    challengeTitle,
    challengeDescription,
    // --- challengeStartDate, challengeEndDate는 이제 백엔드에서 오지 않습니다. ---
    // challengeStartDate,
    // challengeEndDate,
    // --- 대신 모집 기간 필드를 사용합니다. ---
    challengeRecruitStartDate, // 백엔드 DTO에 추가된 필드
    challengeRecruitEndDate,   // 백엔드 DTO에 추가된 필드

    challengeDurationDays, // 유지
    challengeMaxMembers,
    challengeThumbnailPath,
    challengeKeywords = [],
    participantCount = 0
  } = challenge;

  // 썸네일 경로 접두사 처리 (ChallengeCard.jsx와 동일하게 수정)
  const imageUrl = challengeThumbnailPath 
    ? `${BACKEND_BASE_URL}${challengeThumbnailPath}` 
    : '/images/default-thumbnail.png'; 

  // --- 챌린지 상태 계산 로직 (모집 기간 기준) ---
  const today = new Date();
  const recruitStart = new Date(challengeRecruitStartDate);
  const recruitEnd = new Date(challengeRecruitEndDate);

  // 날짜 비교 시 시분초를 무시하고 날짜만 비교하기 위해 자정으로 설정
  today.setHours(0, 0, 0, 0);
  recruitStart.setHours(0, 0, 0, 0);
  recruitEnd.setHours(0, 0, 0, 0);


  let status = '';
  let buttonText = '';
  let isButtonDisabled = true; // 기본적으로 버튼 비활성화

  if (today < recruitStart) {
    status = '모집 예정';
    buttonText = '모집 예정';
  } else if (today >= recruitStart && today <= recruitEnd) {
    status = '모집 중';
    buttonText = '도전하기';
    isButtonDisabled = false; // 모집 중일 때만 버튼 활성화
  } else { // today > recruitEnd (모집 기간이 지났을 경우)
    status = '모집 종료'; // 챌린지 모집이 끝났음을 나타냄
    buttonText = '모집 종료';
    // isButtonDisabled는 true로 유지 (모집 종료 시 참여 불가)
  }

  console.log("현재 날짜:", today.toISOString().split('T')[0]);
  console.log("챌린지 모집 시작일:", challengeRecruitStartDate);
  console.log("챌린지 모집 종료일:", challengeRecruitEndDate);
  console.log("계산된 챌린지 상태 (status):", status); 
  console.log("버튼 텍스트:", buttonText);
  console.log("버튼 비활성화 여부:", isButtonDisabled);


  return (
    <div className="challenge-detail-page">
      <img
        className="challenge-detail-thumbnail"
        src={imageUrl} 
        alt="챌린지 이미지"
      />
      <div className="challenge-detail-content">
        <h2>{challengeTitle}</h2>
        <p className="challenge-detail-description">{challengeDescription}</p>
        <div className="challenge-detail-info">
          {/* --- UI에 모집 기간과 진행 기간을 표시 --- */}
          <div>📅 모집 기간: {challengeRecruitStartDate} ~ {challengeRecruitEndDate}</div>
          <div>🕒 진행 기간: {challengeDurationDays}일</div> {/* '총 기간' 대신 '진행 기간'으로 명확화 */}
          <div>👥 {participantCount}명 / {challengeMaxMembers}명</div>
          <div>📌 현재 상태: {status}</div> {/* 문구 변경 */}
        </div>
        <div className="challenge-detail-keywords">
          {challengeKeywords.map((kw, i) => (
            <span key={i} className="keyword-badge">#{kw}</span>
          ))}
        </div>
        {/* 동적으로 결정된 버튼 렌더링 (이전 방식보다 간결화) */}
        <button
          className="challenge-detail-button"
          onClick={() => {
              if (!isButtonDisabled) { // 버튼이 활성화된 경우에만 모달 띄움
                  setShowModal(true);
              }
            }}
          disabled={isButtonDisabled} // 계산된 isButtonDisabled 값으로 제어
        >
          {buttonText}
        </button>
      </div>
      {showModal && (
        <ChallengeStartModal
          onClose={() => setShowModal(false)}
          challengeId={challengeId}
          // challengeDurationDays를 모달로 전달할 필요가 있다면 여기에 추가
          // challengeDurationDays={challengeDurationDays}
        />
      )}
    </div>
  );
}