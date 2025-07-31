// ChallengeDetail.jsx
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
        // 에러 로깅 강화
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
  }, [challengeId]);

  if (!challenge) return <div>로딩 중...</div>;

  const {
    challengeTitle,
    challengeDescription,
    challengeStartDate,
    challengeEndDate,
    challengeDurationDays,
    challengeMaxMembers,
    challengeThumbnailPath,
    keywords = [],
    participantCount = 0
  } = challenge;

  // 이미지 경로는 이미 올바른 상대 경로이므로 BACKEND_BASE_URL이 필요 없습니다.
  const imageUrl = challengeThumbnailPath 
    ? challengeThumbnailPath 
    : '/images/default-thumbnail.png'; 

  const today = new Date();
  const start = new Date(challengeStartDate);
  const end = new Date(challengeEndDate);

  let status = '모집 중';
  if (today >= start && today <= end) status = '진행 중';
  else if (today > end) status = '종료';

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
          <div>📅 접수 기간: {challengeStartDate} ~ {challengeEndDate}</div>
          <div>🕒 진행 기간: {challengeDurationDays}일</div>
          <div>👥 {participantCount}명 / {challengeMaxMembers}명</div>
          <div>📌 상태: {status}</div>
        </div>
        <div className="challenge-detail-keywords">
          {keywords.map((kw, i) => (
            <span key={i} className="keyword-badge">#{kw}</span>
          ))}
        </div>
        <button
          className="challenge-detail-button"
          onClick={() => setShowModal(true)}
          disabled={status !== '모집 중'}
        >
          도전하기
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