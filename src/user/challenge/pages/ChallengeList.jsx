import { useEffect, useState } from 'react';
import axios from 'axios';
import ChallengeCard from '../components/ChallengeCard';
import { useNavigate } from 'react-router-dom';

export default function ChallengeList() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/challengeList/getChallengeList')
      .then((res) => {
        console.log('챌린지 목록', res.data);
        setChallenges(res.data);
      })
      .catch((err) => console.error('챌린지 불러오기 실패', err));
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 16 }}>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: 10 }}>수련 목록</h2>
      <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: 20 }}>
        원하는 챌린지를 골라 도전해보세요<br />재미와 건강, 보람까지 한 번에!
      </p>

      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.challengeId} challenge={challenge} />
      ))}


      <button
        className="challenge-list-floating-button"
        onClick={() => navigate('/gymmadang/challenge/challengeCreate')}
      >
        ＋
      </button>

    </div>
  );
}
