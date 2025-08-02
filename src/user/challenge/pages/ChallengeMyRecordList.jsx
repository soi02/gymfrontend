import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import MyChallengeCard from '../components/MyChallengeCard';
import '../styles/ChallengeMyRecordList.css';
import { useSelector } from 'react-redux';

const BACKEND_BASE_URL = "http://localhost:8080";

const ChallengeMyRecordList = () => {
  const [myChallengeList, setMyChallengeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();


  const userId = useSelector(state => state.auth.id);
  console.log("현재 로그인한 사용자 ID:", userId);

  useEffect(() => {
  // userId가 없을 경우 로그인 페이지로 리다이렉트
  if (!userId) {
    alert("이곳은 짐마당의 백성들만 들어올 수 있소. 장부에 이름을 등록해주시오.");
    // 로그인 후 현재 페이지로 돌아오도록 state에 현재 경로 저장
    navigate('/gymmadang/login', { state: { from: location.pathname } }); 
    return; // 리다이렉션 후 이펙트 실행 중단
  }

    // userId가 유효할 때만 API 호출
    const fetchMyChallengeList = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching challenges for userId: ${userId}`);
        const response = await axios.get(`${BACKEND_BASE_URL}/api/challenge/getAllMyChallengeListProcess`, {
          params: { userId: userId }
        });
        setMyChallengeList(response.data);
      } catch (err) {
        console.error("나의 챌린지 목록 조회 실패:", err);
        setError("나의 챌린지 목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyChallengeList();
  }, [userId, navigate, location.pathname]); // 의존성 배열에 location.pathname 추가

  // userId가 없으면 로그인 페이지로 이동했으므로, 여기서는 아무것도 렌더링하지 않음
  if (!userId) {
    return null;
  }

  // 로딩, 에러 상태 UI
  if (loading) {
    return <div>로딩 중...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (myChallengeList.length === 0) {
    return <div>참여 중인 챌린지가 없습니다. 새로운 챌린지에 도전해보세요!</div>;
  }

  return (
    <div className="my-challenges-container">
      <h2>나의 수련 기록</h2>
      <div className="challenge-list">
        {myChallengeList.map(challenge => (
          <MyChallengeCard
            key={challenge.challengeId} 
            challenge={challenge}
            onClick={() => navigate(`/gymmadang/challenge/challengeMyRecordList/${challenge.challengeId}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChallengeMyRecordList;