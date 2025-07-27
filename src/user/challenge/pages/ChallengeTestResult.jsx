import { useTestState } from '../hooks/useTestState';
import { useNavigate } from 'react-router-dom';
import '../styles/TestPage.css'; // 스타일 통일

export default function ChallengeTestResult() {
  const { scores, keywords, routine } = useTestState(); // 커스텀 훅에서 정보 가져옴
  const navigate = useNavigate();

  // 성향 점수 계산
  const sortedTypes = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([type]) => type);

  const topType = sortedTypes[0];

  const typeDescriptions = {
    goal: '당신은 목표지향적인 타입이에요!',
    relationship: '사람들과의 연결을 중요시하는 타입이에요!',
    learning: '배움을 통해 성장하는 타입이에요!',
    recovery: '회복과 컨디션을 중시하는 타입이에요!',
    balanced: '균형 잡힌 건강 루틴을 추구하는 타입이에요!',
  };

  return (
    <div className="test-page-body">
      <h2 className="test-question-title">나의 피트니스 성향</h2>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <strong style={{ fontSize: '20px', color: '#2f80ed' }}>{typeDescriptions[topType]}</strong>
        <div style={{ marginTop: '12px', fontSize: '14px' }}>
          주요 성향 순서: {sortedTypes.join(' > ')}
        </div>
      </div>

      <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>📌 관심 키워드</h3>
      <div className="keyword-grid" style={{ marginBottom: '24px' }}>
        {keywords.map((kw, i) => (
          <span key={i} className="keyword-btn selected">{kw}</span>
        ))}
      </div>

      <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>📅 운동 루틴</h3>
      <div style={{ fontSize: '14px' }}>
        <p>운동 요일: {routine.days?.join(', ')}</p>
        <p>운동 지역: {routine.region}</p>
      </div>

      <button
        className="next-button"
        onClick={() => navigate('/challengeList')}
      >
        챌린지 보러가기
      </button>
    </div>
  );
}
