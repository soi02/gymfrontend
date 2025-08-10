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
    // ★ 수정된 부분: URL 파라미터를 감지하여 결제 성공 페이지로 이동시키는 로직 삭제
    // 이 로직은 백엔드가 아닌 프론트엔드에서 결제 승인 API를 직접 호출할 때 필요합니다.
    // 현재 구조에서는 백엔드가 최종적으로 성공 페이지로 리다이렉트하므로 필요 없습니다.
    
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

        const res = await apiClient.get('/challenge/detail', { params });
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
    keywords = [], 
    participantCount = 0,
    challengeDepositAmount = 0,
  } = challenge || {};

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
                    params: { 
                        userId, 
                        challengeId,
                        // ★ 변경된 부분: 백엔드에 전달할 성공 리다이렉트 URL
                        redirectUrl: `${window.location.origin}/gymmadang/challenge/payment/success`
                    },
                }
            );

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
          <div>보증금: {challenge?.challengeDepositAmount.toLocaleString() || 0}원</div>
          <div>모집 기간: {challengeRecruitStartDate} ~ {challengeRecruitEndDate}</div>
          <div>진행 기간: {challengeDurationDays}일</div> 
          <div>{participantCount}명 / {challengeMaxMembers}명</div>
          <div>현재 상태: {status}</div> 
        </div>
        <div className="challenge-detail-keywords">
          {keywords.map((kw, i) => (
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
                        if (!isButtonDisabled) {
                            setShowModal(true); // ★ 수정: 무조건 모달을 띄움
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
                    challengeTitle={challengeTitle} // ★ 추가: 모달에 제목 전달
                    challengeDepositAmount={challengeDepositAmount} // ★ 추가: 모달에 보증금 전달
                    onPaymentStart={handlePaymentStart} // ★ 추가: 결제 시작 핸들러 전달
                />
            )}
    </div>
  );
}