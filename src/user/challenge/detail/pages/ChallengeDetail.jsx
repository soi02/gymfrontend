import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChallengeStartModal from '../components/ChallengeStartModal';
import '../styles/ChallengeDetail.css';

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const BACKEND_BASE_URL = "http://localhost:8080"; 

  useEffect(() => {
    // API 요청은 기존과 동일하게 백엔드 URL을 사용
    axios.get(`${BACKEND_BASE_URL}/api/challengeList/getChallengeDetail?id=${id}`) 
      .then((res) => setChallenge(res.data))
      .catch((err) => {
        console.error("챌린지 상세 실패", err);
        alert("챌린지를 불러올 수 없습니다.");
        navigate(-1);
      });
  }, [id]);

  if (!challenge) return <div>로딩 중...</div>;

  const {
    challengeTitle,
    challengeDescription,
    challengeStartDate,
    challengeEndDate,
    challengeDurationDays,
    challengeMaxMembers,
    challengeThumbnailPath, // 이 값은 이미 "/challengeImages/2025/07/30/..." 형태임
    keywords = [],
    currentMembers = 0
  } = challenge;

  // challengeThumbnailPath 자체가 이미 `/challengeImages/`를 포함하고 있으므로,
  // BACKEND_BASE_URL만 앞에 붙여줍니다.
  const imageUrl = challengeThumbnailPath 
    ? `${BACKEND_BASE_URL}${challengeThumbnailPath}` // ✅ 여기를 수정!
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
          <div>👥 {currentMembers}명 / {challengeMaxMembers}명</div>
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
          challengeId={id}
        />
      )}
    </div>
  );
}