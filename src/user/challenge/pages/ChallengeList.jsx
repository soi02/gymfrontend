// ChallengeList.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import ChallengeCard from '../components/ChallengeCard';
import { useNavigate } from 'react-router-dom';
import '../styles/ChallengeList.css'; // ★ CSS 파일 이름이 ChallengeList.css라고 가정

export default function ChallengeList() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/challengeList/getAllChallengeListProcess')
      .then((res) => {
        console.log('챌린지 목록', res.data);
        setChallenges(res.data);
      })
      .catch((err) => console.error('챌린지 불러오기 실패', err));
  }, []);

  return (
    // 'challenge-list-page'를 가장 바깥 wrapper로 사용하거나,
    // 현재 challenge-list-wrapper의 역할을 challenge-list-page에 통합합니다.
    // 여기서는 challenge-list-wrapper를 유지하되, 내부 구조를 조절합니다.
    <div className="challenge-list-wrapper">
      {/* 이 div에 실제 스크롤이 발생할 내용을 담고, 적절한 스타일을 줍니다. */}
      {/* 여기서는 직접 스타일 대신 클래스를 사용하여 CSS에서 관리하도록 유도합니다. */}
      <div className="challenge-list-container"> {/* ★ 새롭게 추가된 클래스 */}
        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: 10 }}>수련 목록</h2>
        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: 20 }}>
          원하는 챌린지를 골라 도전해보세요<br />재미와 건강, 보람까지 한 번에!
        </p>

        {/* 챌린지 카드 목록 */}
        <div className="challenge-cards-list"> {/* ★ 챌린지 카드들을 감싸는 div 추가 */}
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.challengeId}
              challenge={challenge}
              onClick={() => navigate(`/gymmadang/challenge/detail/${challenge.challengeId}`)}
            />
          ))}
        </div>
      </div>

      {/* 플로팅 버튼은 컨테이너 외부에 두거나, 컨테이너에 z-index를 줘서 덮히지 않도록 합니다. */}
      <button
        className="challenge-list-floating-button"
        onClick={() => navigate('/gymmadang/challenge/challengeCreate')}
      >
        ＋
      </button>
    </div>
  );
}