// src/user/challenge/pages/ChallengeMyRecordDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ChallengeProgressDisplay from '../detail/components/ChallengeProgressDisplay'; // 스티커판 UI 컴포넌트 (추가 생성)
import ChallengeAttendanceForm from '../detail/components/ChallengeAttendanceForm'; // 인증 폼 컴포넌트 (추가 생성)
// import '../styles/ChallengeMyRecordDetail.css'; // 상세 페이지 CSS

const BACKEND_BASE_URL = "http://localhost:8080";

const ChallengeMyRecordDetail = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.id);

  const [progressData, setProgressData] = useState(null); // 백엔드 API 응답 전체를 저장
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요한 페이지입니다.");
      navigate('/login', { state: { from: `/gymmadang/challenge/challengeMyRecordDetail/${challengeId}` } });
      return;
    }

    const fetchChallengeProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        // 백엔드에 새로 만든 API 호출
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
    };

    fetchChallengeProgress();
  }, [challengeId, userId, navigate]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  
  if (!progressData) {
    return <div>챌린지 정보를 찾을 수 없습니다.</div>;
  }
  
  // 인증 기록 제출 후 리프레시 로직 (옵션)
  const handleAttendanceSubmit = () => {
    // 성공적으로 인증이 완료되면, 다시 API를 호출하여 최신 데이터를 가져옴
    // 이 로직은 ChallengeAttendanceForm 컴포넌트 내부에 있거나, 여기서 함수를 prop으로 넘겨줄 수 있습니다.
    // 예를 들어, 새로운 API 호출 함수를 만들어서 여기서 재실행
  };

  return (
    <div className="challenge-detail-container">
      {/* 챌린지 기본 정보 */}
      <h2 className="challenge-detail-title">{progressData.challengeTitle}</h2>
      <p>총 기간: {progressData.totalPeriod}일</p>
      <p>나의 달성 횟수: {progressData.myAchievement}회</p>
      <div className="norigae-info">
        <h3>노리개 정보</h3>
        <p>이름: {progressData.norigaeName}</p>
        <p>달성률: {progressData.norigaeConditionRate}%</p>
        <img src={progressData.norigaeIconPath} alt={progressData.norigaeName} />
      </div>

      {/* 스티커판 UI를 렌더링하는 컴포넌트 */}
      {/* 백엔드에서 받은 challengeAttendanceStatus를 prop으로 넘겨줍니다. */}
      <ChallengeProgressDisplay statusList={progressData.challengeAttendanceStatus} />
      
      {/* 일일 인증 사진 업로드 폼 컴포넌트 */}
      <ChallengeAttendanceForm challengeId={challengeId} userId={userId} onAttendanceSuccess={handleAttendanceSubmit} />
    </div>
  );
};

export default ChallengeMyRecordDetail;