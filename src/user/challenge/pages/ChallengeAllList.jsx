// src/pages/ChallengeAllList.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChallengeAllList.css';
import apiClient from '../../../global/api/apiClient';

export default function ChallengeAllList() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_BASE_URL = "http://localhost:8080"; // 👈 추가

  useEffect(() => {
    const fetchAllChallenges = async () => {
      try {
        const res = await apiClient.get('/challenge/list');
        setChallenges(res.data || []);
      } catch (err) {
        console.error('모든 챌린지 목록 불러오기 실패', err);
        setError('모든 챌린지 목록을 불러오는 데 실패하였습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllChallenges();
  }, []);

  const handleChallengeClick = (challengeId) => {
    navigate(`/challenge/${challengeId}`);
  };

  if (loading) {
    return <div className="all-challenge-list-container">로딩 중이오...</div>;
  }

  if (error) {
    return <div className="all-challenge-list-container">{error}</div>;
  }

  if (challenges.length === 0) {
    return <div className="all-challenge-list-container">아직 도전할 수 있는 수련이 없사옵니다.</div>;
  }

  return (
    <div className="all-challenge-list-wrapper">
      <div className="all-challenge-list-container">
        <div className="list-header">
          <h2>모든 수련</h2>
          <p>이곳에 모든 수련 목록이 있사옵니다.</p>
        </div>
        <div className="challenge-cards-grid">
          {challenges.map((challenge) => (
            <div
              key={challenge.challengeId}
              className="challenge-card"
              onClick={() => handleChallengeClick(challenge.challengeId)}
            >
              <img
                // 챌린지 카드 컴포넌트와 동일하게 백엔드 URL을 앞에 붙여줍니다.
                src={`${BACKEND_BASE_URL}${challenge.challengeThumbnailPath}`}
                alt={challenge.challengeTitle}
                className="challenge-image"
              />
              <div className="challenge-info">
                {/* challenge.status 필드는 백엔드 응답에 없으므로 일단 제거하거나, 백엔드에서 해당 필드를 추가해야 합니다. */}
                <span className="challenge-status">{/* 상태 정보 */}</span>
                {/* 백엔드 필드명: challengeTitle */}
                <h3 className="challenge-title">{challenge.challengeTitle}</h3>
                {/* challenge.description 필드는 백엔드 응답에 없으므로 일단 제거하거나, 백엔드에서 해당 필드를 추가해야 합니다. */}
                <p className="challenge-description">{/* 설명 정보 */}</p>
                <div className="challenge-meta">
                  <span className="challenge-participants">
                    {/* 백엔드 필드명: challengeParticipantCount */}
                    참가자: {challenge.challengeParticipantCount}명
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}