import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import ChallengeCard from '../components/ChallengeCard';
import '../styles/ChallengeList.css';

export default function ChallengeList() {
  const navigate = useNavigate();
  const [challengeList, setChallengeList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/challengeList/getChallengeList')
      .then((res) => {
        console.log('응답 결과:', res.data);
        setChallengeList(res.data); // 서버 응답 데이터를 상태에 저장
      })
      .catch((err) => {
        console.error('챌린지 목록 불러오기 실패:', err);
      });
  }, []);

  return (
    <div className="challenge-list-page">
      <header>
        <h2>하자고! 챌린지를</h2>
        <p>원하는 챌린지를 골라 도전해보세요</p>
      </header>

      <div className="challenge-list">
        {challengeList.map((ch, i) => (
          <ChallengeCard key={i} challenge={ch} />
        ))}
      </div>

      <button
        className="challenge-list-floating-button"
        onClick={() => navigate('/gymmadang/challenge/challengeCreate')}
      >
        ＋
      </button>
    </div>
  );
}
