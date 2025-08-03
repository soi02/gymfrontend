// src/user/challenge/pages/ChallengeMyRecordDetail.jsx
import React, { useState, useEffect, useCallback } from 'react'; // useCallback import 추가
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ChallengeProgressDisplay from '../detail/components/ChallengeProgressDisplay';
import ChallengeAttendanceForm from '../detail/components/ChallengeAttendanceForm';
import '../styles/ChallengeMyRecordDetail.css'; 

const BACKEND_BASE_URL = "http://localhost:8080";

const ChallengeMyRecordDetail = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.id);

  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // fetchChallengeProgress 함수를 컴포넌트 최상위 스코프에 정의
  // useCallback을 사용하여 함수를 메모이제이션하면, 불필요한 재렌더링을 방지할 수 있습니다.
  const fetchChallengeProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BACKEND_BASE_URL}/api/challenge/getChallengeProgressProcess`, {
        params: { userId: userId, challengeId: challengeId }
      });
      console.log("챌린지 상세 진행 상황 API 응답:", response.data);
      setProgressData(response.data);
    } catch (err) {
      console.error("챌린지 상세 진행 상황 조회 실패:", err);
      setError("챌린지 진행 상황을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userId, challengeId]); // 의존성 배열에 userId와 challengeId 추가

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요한 페이지입니다.");
      navigate('/login', { state: { from: `/gymmadang/challenge/challengeMyRecordDetail/${challengeId}` } });
      return;
    }
    
    // useEffect 내에서 정의된 함수가 아니므로 바로 호출
    fetchChallengeProgress();
  }, [challengeId, userId, navigate, fetchChallengeProgress]); // 의존성 배열에 fetchChallengeProgress 추가

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  
  if (!progressData) {
    return <div>챌린지 정보를 찾을 수 없습니다.</div>;
  }
  
  return (
    <div className="challenge-detail-container">
      {/* 챌린지 기본 정보 */}
      <h2 className="challenge-detail-title">{progressData.challengeTitle}</h2>
      <p>총 기간: {progressData.totalPeriod}일</p>
      <p>나의 달성 횟수: {progressData.myAchievement}회</p>

      {/* 획득한 노리개 등급 정보를 표시 (조건부 렌더링) */}
      {progressData.awardedNorigaeName && (
        <div className="norigae-badge">
          <img 
            src={progressData.awardedNorigaeIconPath} 
            alt={progressData.awardedNorigaeName} 
          />
        </div>
      )}
      
      {/* 스티커판 UI를 렌더링하는 컴포넌트 */}
      <ChallengeProgressDisplay statusList={progressData.challengeAttendanceStatus} />
      
      {/* 일일 인증 사진 업로드 폼 컴포넌트 */}
      {/* fetchChallengeProgress 함수를 prop으로 전달 */}
      <ChallengeAttendanceForm challengeId={challengeId} userId={userId} onAttendanceSuccess={fetchChallengeProgress} />
    </div>
  );
};

export default ChallengeMyRecordDetail;