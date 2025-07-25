import { useNavigate } from 'react-router-dom';
import '../styles/ChallengeIntro.css';

export default function ChallengeIntro() {
  const navigate = useNavigate();

  return (
    <div className="challenge-intro-body">
      <div className="challenge-intro-welcome-container">
        <div className="challenge-intro-content">
          <h2 className="challenge-intro-title">수련장</h2>
          <p className="challenge-intro-subtitle">수련장에 발을 들이신 것을 환영하오.</p>
          <p className="challenge-intro-subtitle">
            그대의 수련 여정이 이제 막 시작되었소.<br />
            스스로의 수련을 정하고, 도전에 임해보시오!
          </p>

          <div className="challenge-intro-button-group">
            <button className="btn challenge-intro-btn primary" onClick={() => navigate('/personality-test')}>
              성향을 알아보고 수련을 추천받겠소
            </button>
            <button className="btn challenge-intro-btn" onClick={() => navigate('/challengeHome')}
            >
              곧장 수련장을 둘러보겠소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

