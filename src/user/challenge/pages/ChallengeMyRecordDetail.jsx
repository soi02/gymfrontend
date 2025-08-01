import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ChallengeRecordCard from '../components/MyChallengeCard'; // 인증 기록 카드 컴포넌트 (추후 생성)
// import '../styles/ChallengeMyRecordDetail.css'; // 상세 페이지 CSS

const BACKEND_BASE_URL = "http://localhost:8080";

const ChallengeMyRecordDetail = () => {
  const { challengeId } = useParams(); // URL 파라미터에서 challengeId 추출
  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.id);

  const [challenge, setChallenge] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 로그인 상태 확인
    if (!userId) {
      alert("로그인이 필요한 페이지입니다.");
      navigate('/login', { state: { from: `/ChallengeMyRecordList/${challengeId}` } });
      return;
    }

    const fetchChallengeDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // 챌린지 상세 정보 및 인증 기록을 가져오는 API 호출
        const response = await axios.get(`${BACKEND_BASE_URL}/api/challenge/getMyRecordDetailProcess`, {
          params: { userId: userId, challengeId: challengeId }
        });

        console.log("API Response Data:", response.data); // 여기에 로그 추가

        // 백엔드 응답 구조에 맞게 상태 저장
        setChallenge(response.data.challengeInfo);
        setRecords(response.data.challengeRecordInfoList);

      } catch (err) {
        console.error("챌린지 상세 기록 조회 실패:", err);
        setError("챌린지 상세 기록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeDetails();
    console.log("Fetching details for challengeId:", challengeId); // 여기에 로그를 추가
  }, [challengeId, userId, navigate]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  
  // 챌린지 데이터가 없거나 로드되지 않았을 경우
  if (!challenge) {
    return <div>챌린지 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="challenge-detail-container">
      <h2 className="challenge-detail-title">{challenge.challengeTitle}</h2>
      <p className="challenge-detail-description">{challenge.challengeDescription}</p>
      
      {/* 챌린지 상세 정보와 진행 상태를 보여주는 UI 추가 */}
      <div className="challenge-progress-summary">
        <p>진행 기간: {challenge.challengeDurationDays}일</p>
        <p>인증 횟수: {challenge.daysAttended}회</p>
      </div>

      <div className="challenge-records-list">
        {records.length > 0 ? (
          records.map(record => (
            <ChallengeRecordCard
              key={record.recordId}
              record={record}
            />
          ))
        ) : (
          <div>아직 인증 기록이 없습니다. 첫 인증을 시작해보세요!</div>
        )}
      </div>
    </div>
  );
};

export default ChallengeMyRecordDetail;