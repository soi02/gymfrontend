import { useNavigate } from 'react-router-dom';
import '../styles/ChallengeIntro.css';

export default function ChallengeIntro() {
  const navigate = useNavigate();

  return (
    <div className="challenge-welcome-container">
      <div className="intro-content">
        <h2 className="title">수련장</h2>
        <p className="subtitle">챌린지 수련장에 오신걸 환영해요!</p>
        <p className="subtitle">
          목표를 향한 여정이 지금 시작됩니다.<br />
          당신만의 챌린지를 만들고, 함께 도전해보세요!
        </p>
      </div>

      <div className="challenge-button-group">
        <button className="btn challenge-btn" onClick={() => navigate('/personality-test')}>
          성향 테스트 후 챌린지 추천 받기
        </button>
        <button className="btn challenge-btn" onClick={() => navigate('/challengeHome')}>
          바로 수련장 둘러보기
        </button>
      </div>
    </div>
  );
}

