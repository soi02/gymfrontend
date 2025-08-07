// src/challenge/pages/ChallengeDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChallengeStartModal from '../components/ChallengeStartModal';
import '../styles/ChallengeDetail.css';
import { useSelector } from 'react-redux';
import apiClient from '../../../../global/api/apiClient';






export default function ChallengeDetail() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userId = useSelector(state => state.auth.id); 
  const BACKEND_BASE_URL = "http://localhost:8080"; 

  useEffect(() => {
    // URLSearchParams를 사용하여 현재 URL에서 쿼리 파라미터를 추출합니다.
    const urlParams = new URLSearchParams(window.location.search);
    const pgToken = urlParams.get('pg_token');
    const challengeIdFromUrl = urlParams.get('challengeId');
    const userIdFromUrl = urlParams.get('userId');

    // 결제 성공 후 리다이렉트된 경우
    if (pgToken && challengeIdFromUrl && userIdFromUrl) {
      console.log("결제 성공 리다이렉트 감지. pg_token:", pgToken);
      // 백엔드의 결제 성공 API 호출은 백엔드 내부적으로 처리되므로, 
      // 프론트엔드는 결제 성공 후 보여줄 페이지로 이동하면 됩니다.
      alert('결제가 성공적으로 완료되었습니다! 챌린지에 참여합니다.');
      // 챌린지 상세 페이지로 돌아가기 위해 URL을 정리하고 상태를 업데이트합니다.
      // 또는 마이페이지 등으로 이동시킬 수 있습니다.
      navigate(`/gymmadang/challenge/detail/${challengeId}`, { replace: true });
      return;
    }
    
    // 정상적인 챌린지 상세 페이지 로딩
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
        if (userId) {
          params.userId = userId;
        }

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
    challengeRecruitStartDate, 
    challengeRecruitEndDate,   
    challengeDurationDays, 
    challengeMaxMembers,
    challengeThumbnailPath,
    challengeKeywords = [],
    participantCount = 0,
    challengeDepositAmount = 0, // ★ 추가: 보증금 필드
  } = challenge || {}; // challenge가 null일 경우 빈 객체를 기본값으로 사용

  const imageUrl = challengeThumbnailPath 
    ? `${BACKEND_BASE_URL}${challengeThumbnailPath}` 
    : '/images/default-thumbnail.png'; 

  const today = new Date();
  const recruitStart = new Date(challengeRecruitStartDate);
  const recruitEnd = new Date(challengeRecruitEndDate);

  const isUserParticipating = challenge?.userParticipating || false;

  today.setHours(0, 0, 0, 0);
  recruitStart.setHours(0, 0, 0, 0);
  recruitEnd.setHours(0, 0, 0, 0);

  let status = '';
  let buttonText = '';
  let isButtonDisabled = true; 
  let showChatButton = false; 

if (today >= recruitStart && today <= recruitEnd) {
    if (isUserParticipating) {
        status = '도전 중';
        buttonText = '도전 중';
        isButtonDisabled = true; 
        showChatButton = true; 
    } else {
        status = '모집 중';
        buttonText = '도전하기';
        isButtonDisabled = false; 
    }
}
else if (today < recruitStart) {
    status = '모집 예정';
    buttonText = '모집 예정';
    isButtonDisabled = true;
} else { // today > recruitEnd
    status = '모집 종료';
    buttonText = '모집 종료';
    isButtonDisabled = true;
}

  const handleChatEntry = () => {
    navigate(`/gymmadang/challenge/groupchat/${challengeId}`);
  };

  // ★ 추가: 결제 시작 핸들러 함수
const handlePaymentStart = async () => {
  if (!userId) {
    alert("로그인 후 이용 가능합니다.");
    navigate('/gymmadang/login');
    return;
  }

  try {
    const res = await apiClient.post(
      `/challenge/join/payment`, 
      null,
      {
        params: { userId, challengeId },
      }
    );
    
    // 백엔드에서 PaymentReadyResponse DTO를 반환하므로,
    // DTO의 redirectUrl 필드를 사용합니다.
    if (res.data && res.data.redirectUrl) {
      window.location.href = res.data.redirectUrl;
    } else {
      alert("결제 준비에 실패했습니다.");
    }

  } catch (err) {
    console.error("결제 실패", err);
    alert("결제 과정 중 오류가 발생했습니다: " + (err.response?.data || err.message));
  }
};


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
          <div>💸 보증금: {challenge?.challengeDepositAmount.toLocaleString() || 0}원</div>
          <div>📅 모집 기간: {challengeRecruitStartDate} ~ {challengeRecruitEndDate}</div>
          <div>🕒 진행 기간: {challengeDurationDays}일</div> 
          <div>👥 {participantCount}명 / {challengeMaxMembers}명</div>
          <div>📌 현재 상태: {status}</div> 
        </div>
        <div className="challenge-detail-keywords">
          {challengeKeywords.map((kw, i) => (
            <span key={i} className="keyword-badge">#{kw}</span>
          ))}
        </div>

        {showChatButton && (
          <button 
            className="challenge-detail-button chat-button"
            onClick={handleChatEntry}
          >
            채팅방 입장
          </button>
        )}
        <button
          className="challenge-detail-button"
          onClick={() => {
              // 모달 대신 결제 핸들러 직접 호출
              if (!isButtonDisabled) {
                  // 보증금 없는 챌린지일 경우
                  if (challengeDepositAmount === 0) {
                      setShowModal(true); // 기존 모달을 사용하여 바로 참여
                  } else {
                      handlePaymentStart(); // 보증금 있는 챌린지는 결제 시작
                  }
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