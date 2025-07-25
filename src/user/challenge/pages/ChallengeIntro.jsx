import { useNavigate } from 'react-router-dom';
import '../styles/ChallengeIntro.css';

import challengeImg from "../../../assets/img/challenge/challenge_char.png";


export default function ChallengeIntro() {
  const navigate = useNavigate();

  return (
  <div className="challenge-intro-body">
    <div className="challenge-intro-welcome-container">
      <div className="challenge-intro-content">
        <h2 className="challenge-intro-title">수련장</h2>

        <img
          src={challengeImg}
          alt="챌린지 이미지"
          style={{ width: "80%", marginTop: "15px", marginBottom: "30px" }}
        />
        <p className="challenge-intro-subtitle">수련장에 발을 들이신 것을 환영하오.</p>
        <p className="challenge-intro-subtitle">
          그대의 수련 여정이 이제 막 시작되었소.<br />
          스스로의 수련을 정하고, 도전에 임해보시오!
        </p>
      </div>
    </div>

    <div className="fixed-button-group">
      <button className="btn challenge-intro-btn primary" onClick={() => navigate('/personality-test')}>
        성향을 알아보고 수련을 추천받겠소
      </button>
      <button className="btn challenge-intro-btn" onClick={() => navigate('/challengeHome')}>
        곧장 수련장을 둘러보겠소
      </button>
    </div>
  </div>

  );
}

