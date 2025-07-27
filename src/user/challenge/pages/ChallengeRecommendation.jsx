
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/TestPage.css'; // 기존 스타일 재사용

export default function ChallengeRecommendation() {
  const navigate = useNavigate();
  const { scores, keywords, routine } = useSelector((state) => state.test);

  const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0) || 1;
  const scorePercent = (val) => Math.round((val / totalScore) * 100);

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const [topType] = sorted[0];

  const labelMap = {
    goal: '목표지향형',
    relationship: '관계지향형',
    recovery: '회복지향형',
    learning: '학습지향형',
    balanced: '균형형',
  };

  // TODO: 나중에 백엔드 추천 로직이 붙으면 이 부분 서버에서 받아올 수 있음
  const recommendedChallenges = [
    '[더미]목표 달성 루틴 챌린지',
    '[더미]함께하는 체크인 챌린지',
    '[더미]회복 루틴 챌린지',
    '[더미]학습 성장 루틴 챌린지',
    '[더미]균형잡힌 습관 챌린지'
  ];

  return (
    <div className="test-page-body">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 className="test-question-title">💡 이런 챌린지는 어때요?</h2>
        <p style={{ fontSize: '14px', color: '#555' }}>
          {labelMap[topType]}인 당신에게 추천하는 챌린지예요!
        </p>
      </div>

      <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '36px' }}>
        {recommendedChallenges.map((challenge, i) => (
          <li key={i} style={{
            padding: '12px 16px',
            background: '#f5f5f5',
            borderRadius: '12px',
            marginBottom: '10px',
            fontSize: '15px',
          }}>
            {challenge}
          </li>
        ))}
      </ul>

      <button
        className="next-button"
        onClick={() => navigate('/challengeList')}
      >
        챌린지 전체 보러가기
      </button>
    </div>
  );
}
