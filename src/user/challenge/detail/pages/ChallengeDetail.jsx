import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChallengeStartModal from '../components/ChallengeStartModal';
import '../styles/ChallengeDetail.css';
import { useSelector } from 'react-redux';
import apiClient from '../../../../global/api/apiClient';

export default function ChallengeDetail() {
  const { challengeId } = useParams();
  console.log("URL에서 추출된 challengeId:", challengeId); 

  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = useSelector(state => state.auth.id); // 로그인 상태에 따라 userId가 들어있음

  const BACKEND_BASE_URL = "http://localhost:8080"; 

  useEffect(() => {
    if (!challengeId) {
      alert("잘못된 접근입니다.");
      navigate('/gymmadang/challenge/challengeHome');
      return;
    }

    const fetchChallengeDetail = async () => {
      try {
        const params = {
          challengeId: challengeId
        };
        // userId가 유효할 경우에만 params 객체에 추가
        if (userId) {
          params.userId = userId;
        }

        // ★★★ apiClient를 사용하여 URL과 파라미터를 분리하여 전송 ★★★
        const res = await apiClient.get('/challenge/getChallengeDetailByChallengeIdProcess', { params });

        console.log("챌린지 상세 데이터 수신:", res.data);
        setChallenge(res.data);
      } catch (err) {
        console.error("챌린지 상세 실패", err);
        alert("챌린지를 불러올 수 없습니다.");
        navigate('/gymmadang/challenge/challengeHome');
      }
    };

    fetchChallengeDetail();
  }, [challengeId, userId, navigate]);

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

  const isUserParticipating = challenge?.userParticipating || false;

  // 날짜 비교 시 시분초를 무시하고 날짜만 비교하기 위해 자정으로 설정
  today.setHours(0, 0, 0, 0);
  recruitStart.setHours(0, 0, 0, 0);
  recruitEnd.setHours(0, 0, 0, 0);



  let status = '';
  let buttonText = '';
  let isButtonDisabled = true; // 기본적으로 버튼 비활성화
  let showChatButton = false; // 채팅방 버튼 표시 여부(기본적으로 비활성화, 변수명이 위에랑 달라서 false 라고 함)

// 모집 기간 내에 있을 경우
if (today >= recruitStart && today <= recruitEnd) {
    if (isUserParticipating) {
        // ★★★ 사용자가 이미 참여한 경우의 로직 ★★★
        status = '도전 중';
        buttonText = '도전 중';
        isButtonDisabled = true; // 버튼 비활성화
        showChatButton = true; // 참여 중일 때 채팅방 버튼 활성화
    } else {
        // ★★★ 모집 중이고, 아직 참여하지 않은 경우의 로직 ★★★
        status = '모집 중';
        buttonText = '도전하기';
        isButtonDisabled = false; // 버튼 활성화
    }
}
// 모집 기간이 아닐 경우 (모집 예정 또는 종료) 
else if (today < recruitStart) {
    status = '모집 예정';
    buttonText = '모집 예정';
    isButtonDisabled = true;
} else { // today > recruitEnd
    status = '모집 종료';
    buttonText = '모집 종료';
    isButtonDisabled = true;
}

  // 채팅방 입장 핸들러 함수
  const handleChatEntry = () => {
    navigate(`/gymmadang/challenge/groupchat/${challengeId}`);
  };

console.log("현재 날짜:", today.toISOString().split('T')[0]);
console.log("챌린지 모집 시작일:", challengeRecruitStartDate);
console.log("챌린지 모집 종료일:", challengeRecruitEndDate);
console.log("계산된 챌린지 상태 (status):", status); 
console.log("사용자 참여 여부 (isUserParticipating):", isUserParticipating); // ★★★ 로그 추가
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

        {showChatButton && (
          <button 
            className="challenge-detail-button chat-button" // 새로운 CSS 클래스 추가
            onClick={handleChatEntry}
          >
            채팅방 입장
          </button>
        )}
        <button
          className="challenge-detail-button"
          onClick={() => {
              if (!isButtonDisabled) {
                  setShowModal(true);
              }
            }}
          disabled={isButtonDisabled}
        >
          {buttonText}
        </button>
      </div>
      {showModal && (
        <ChallengeStartModal
          onClose={() => setShowModal(false)}
          challengeId={challengeId}
        />
      )}
    </div>
  );
}