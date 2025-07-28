
import { useSelector} from 'react-redux';

import { useNavigate } from 'react-router-dom';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import '../styles/TestPage.css'; // 공통 스타일


import goalImg from '../../../assets/img/challenge/test/goal.png';
import relationshipImg from '../../../assets/img/challenge/test/relationship.png';
import recoveryImg from '../../../assets/img/challenge/test/recovery.png';
import learningImg from '../../../assets/img/challenge/test/learning.png';
import balancedImg from '../../../assets/img/challenge/test/balanced.png';



export default function ChallengeTestResult() {
  const navigate = useNavigate();
  const { scores, keywords, routine } = useSelector((state) => state.test);

  // 유효성 검사: 모든 점수가 0이면 테스트 안 한 것
  const hasValidScore = Object.values(scores).some((v) => v > 0);

  if (!hasValidScore) {
    return (
      <div className="test-page-body" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          ⚠️ 테스트 결과가 존재하지 않아요.
        </p>
        <button
          className="next-button"
          onClick={() => navigate('/gymmadang/challenge/challengeTest/step/1')}
        >
          테스트 하러가기
        </button>
      </div>
    );
  }

  const imageMap = {
    goal: goalImg,
    relationship: relationshipImg,
    recovery: recoveryImg,
    learning: learningImg,
    balanced: balancedImg,
  };

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

  const descriptionMap = {
    goal: '당신은 명확한 목표를 세우고 그것을 달성하기 위해 꾸준히 나아가는 타입이에요. 루틴을 계획하고, 성취감을 통해 동기를 얻는 편이에요.',
    relationship: '혼자보다는 함께할 때 에너지를 얻는 타입이에요. 친구나 지인과 함께하는 운동이나 커뮤니티 활동을 즐깁니다.',
    recovery: '몸과 마음의 회복을 중요하게 여기는 타입이에요. 휴식, 스트레칭, 마인드풀니스 등 건강한 재충전에 가치를 둡니다.',
    learning: '새로운 것을 배우고 익히는 과정을 좋아하는 타입이에요. 다양한 운동을 시도하고 정보를 수집하며 성장해 나갑니다.',
    balanced: '균형 잡힌 생활을 중시하는 타입이에요. 무리하지 않고 지속 가능한 루틴을 지향하며, 건강과 삶의 조화를 추구해요.',
  };


  const radarData = Object.entries(scores).map(([type, value]) => ({
    
    subject: labelMap[type],
    A: scorePercent(value),
    fullMark: 100
  }));

  
console.log("📊 radarData", radarData);

  const recommendedChallenges = [
    '🧘 스트레칭 루틴 챌린지',
    '💤 숙면 유도 챌린지',
    '💪 오늘도 출첵 챌린지',
    '🍽️ 건강식단 공유 챌린지'
  ];





  return (
<div className="test-page-body">

{/* 대표 성향 섹션 */}
<div style={{ textAlign: 'center', marginBottom: '27px' }}>
  <h2 className="test-result-title">[닉네임]님의 타입은</h2>

  {/* 성향명 강조 */}
  <div style={{ fontSize: '22px', fontWeight: '700', color: '#2f80ed', marginBottom: '17px' }}>
    {labelMap[topType]}
  </div>

  {/* 캐릭터 + 말풍선 */}
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', gap: '16px' }}>
    <img
      src={imageMap[topType]}
      alt={labelMap[topType]}
      style={{ width: '100px', flexShrink: 0 }}
    />

    <div
      style={{
        position: 'relative',
        background: '#f1f3f5',
        padding: '12px 14px',
        borderRadius: '14px',
        maxWidth: '220px',
        fontSize: '13.5px',
        lineHeight: '1.5',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        textAlign: 'left',
        color: '#333'
      }}
    >
      {descriptionMap[topType]}
      <div
        style={{
          content: '""',
          position: 'absolute',
          left: '-8px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '8px solid #f1f3f5',
        }}
      />
    </div>
  </div>
</div>


  {/* 레이더 차트 */}
  <div style={{ width: '100%', height: 200, marginBottom: '5px' }}>
    <ResponsiveContainer>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          tick={{
            fontSize: 12,
            fill: '#333',
            textAnchor: 'middle',
          }}
          tickFormatter={(value) => {
            const match = radarData.find((d) => d.subject === value);
            return `${value}\n${match?.A || 0}%`;
          }}
        />


        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="나의 성향" dataKey="A" stroke="#2f80ed" fill="#2f80ed" fillOpacity={0.4} />
      </RadarChart>
    </ResponsiveContainer>
  </div>

  {/* 성향별 점수 퍼센트 */}
  <div style={{ marginBottom: '28px', fontSize: '13px', color: '#555' }}>
    {radarData.map((item, idx) => (
      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 6px' }}>
        <span>{item.subject}</span>
        <span>{item.A}%</span>
      </div>
    ))}
  </div>

{/* 성향별 점수 카드형 (2 + 3) */}
{/* <div style={{ width: '100%', marginBottom: '28px' }}>
  {/* 상단 2개 */}
  {/* <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '14px',
      marginBottom: '12px',
    }}
  >
    {radarData.slice(0, 2).map((item, idx) => (
      <div
        key={idx}
        style={{
          flex: '0 0 140px',
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13.5px',
          color: '#333',
        }}
      >
        <span>{item.subject}</span>
        <span style={{ fontWeight: '600', color: '#2f80ed' }}>{item.A}%</span>
      </div>
    ))}
  </div>

  {/* 하단 3개 */}
  {/* <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    }}
  >
    {radarData.slice(2).map((item, idx) => (
      <div
        key={idx + 2}
        style={{
          flex: '0 0 100px',
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '10px 14px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13.5px',
          color: '#333',
        }}
      >
        <span>{item.subject}</span>
        <span style={{ fontWeight: '600', color: '#2f80ed' }}>{item.A}%</span>
      </div>
    ))}
  </div>
</div> */}







  <button className="next-button" onClick={() => navigate('/gymmadang/challenge/challengeTest/Recommend')}>
    추천 챌린지 보기
  </button>

{/* <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', marginBottom: '40px' }}>
  <button
  style={{
    position: 'fixed',
    bottom: '80px', // next-button 위에
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#e9ecef',
    color: '#333',
    fontSize: '13px',
    borderRadius: '20px',
    padding: '8px 16px',
    border: 'none',
    cursor: 'pointer',
    zIndex: 10
  }}
    onClick={() => {
      const shareText = `[나의 건강 성향] ${labelMap[topType]} - ${descriptionMap[topType]}`;
      navigator.clipboard.writeText(shareText);
      alert('결과가 복사되었어요! SNS에 붙여넣어 공유해보세요.');
    }}
  >
    결과 공유하기
  </button>
</div> */}


</div>

  );
}
