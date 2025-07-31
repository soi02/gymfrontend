// ChallengeList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import ChallengeCard from '../components/ChallengeCard';
import { useNavigate } from 'react-router-dom';
import '../styles/ChallengeList.css';

export default function ChallengeList() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/challenge/getAllChallengeListProcess')
      .then((res) => {
        console.log('챌린지 목록', res.data);
        setChallenges(res.data);
      })
      .catch((err) => console.error('챌린지 불러오기 실패', err));
  }, []);

  return (

    <div className="challenge-list-wrapper">

      <div className="challenge-list-container">
        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: 10 }}>수련 목록</h2>
        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: 20 }}>
          원하는 챌린지를 골라 도전해보세요
        </p>

        {/* 챌린지 카드 목록 */}
        <div className="challenge-cards-list">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.challengeId}
              challenge={challenge}
              onClick={() => navigate(`/gymmadang/challenge/detail/${challenge.challengeId}`)}
            />
          ))}
        </div>
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