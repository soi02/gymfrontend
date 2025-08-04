
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
import { useEffect, useState } from 'react';
import apiClient from '../../../global/api/apiClient';


// 백엔드 tendency 테이블의 ID와 매핑
const tendencyMapping = {
  goal: 1,
  relationship: 2,
  recovery: 3,
  learning: 4,
  balanced: 5,
};

// 백엔드 keyword 테이블의 ID와 매핑 (★DB의 실제 ID에 맞게 채워넣어야 함)
const keywordMapping = {
  '루틴': 1, '스트레스': 2, '고중량': 3, 'PR갱신': 4, '바디프로필': 5,
  '새벽헬스': 6, '원정헬스': 7, '헬스습관': 8, '홈트': 9, '운동복': 10,
  '운동기구': 11, '스트레칭': 12, '재활': 13, '부상예방': 14,
  '마사지볼': 15, '슬로우워크': 16, '헬태기 극복': 17, '같이해요': 18,
  '응원해요': 19, '오늘도출첵': 20, '그룹챗': 21, '서로서로': 22,
  '오운완 인증': 23, '자세교정': 24, '식단정보': 25, '초보루틴': 26,
  '헬스상식': 27, 'PT복습': 28, '헬스꿀팁': 29, '헬스고민': 30,
  '물 2L': 31, '미라클모닝': 32, '일찍자기': 33, '아침 산책': 34,
  '바디체크': 35, 'Before/After': 36, '체중감량': 37, '미션인증': 38,
  '기록공유': 39, '대회 준비': 40, '헬스노트': 41, '루틴계획': 42,
  '마이페이스': 43, '한달기록': 44, '나와의약속': 45, '다이어트': 46,
  '건강식단': 47
};


export default function ChallengeTestResult() {
  const navigate = useNavigate();
  const { scores, keywords } = useSelector((state) => state.test);
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);

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


  useEffect(() => {
    const fetchRecommendedChallenges = async () => {
      try {
        const keywordIds = keywords.map(kw => keywordMapping[kw]).filter(id => id);
        // const tendencyId = tendencyMapping[topType];

        console.log("추천 API 호출 파라미터:", { keywordIds });

        const res = await apiClient.get('/challenge/getRecommendedChallengeListProcess', {
          params: {
            // tendencyId: tendencyId,
            keywordIds: keywordIds.join(',')
          }
        });

        console.log('추천 챌린지 목록', res.data);
        setRecommendedChallenges(res.data);
      } catch (err) {
        console.error('추천 챌린지 불러오기 실패', err);
      }
    };
    
    // 테스트 결과가 유효할 때만 API 호출
    if (hasValidScore) {
        fetchRecommendedChallenges();
    }
  }, [hasValidScore, topType, keywords]);


  return (


    
<div className="test-page-body">

  {/* 상단 닫기 버튼 (X) */}
<div style={{
  position: 'absolute',
  top: '18px',
  right: '18px',
  zIndex: 10,
}}>
  <button
    onClick={() => navigate('/gymmadang/challenge/challengeHome')}
    style={{
      background: 'transparent',
      border: 'none',
      fontSize: '22px',
      fontWeight: '500',
      color: '#555',
      cursor: 'pointer',
    }}
    aria-label="닫기"
  >
    ✕
  </button>
</div>


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


{/* --- 레이더 차트 --- */}
<div style={{ width: '100%', height: 185, marginBottom: '4px' }}>
  <ResponsiveContainer>
    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
      <PolarGrid />
      <PolarAngleAxis
        dataKey="subject"
        tick={{ fontSize: 12, fill: '#333', textAnchor: 'middle' }}
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

      {/* --- 추천 챌린지 섹션 --- */}
      <div style={{ padding: '0 14px', marginTop: '0.3rem' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '2px' }}>
          이런 챌린지는 어때요?
        </h3>

        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '18px' }}>
          {recommendedChallenges.length > 0 ? (
            recommendedChallenges.map((challenge, idx) => (

                    <li 
                      key={challenge.challengeId}
                      style={{          
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        fontSize: '14px',
                        marginBottom: '10px',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',}}
                              onClick={() => navigate(`/gymmadang/challenge/detail/${challenge.challengeId}`)}
                            >
                      {challenge.challengeTitle}
              </li>
            ))
          ) : (
            <li>추천 챌린지가 없습니다.</li>
          )}
        </ul>

{/* 버튼 영역 */}
<div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <button
    onClick={() => navigate('/gymmadang/challenge/challengeTest/recommend')}
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      background: '#e7f0ff',
      color: '#2f80ed',
      border: '1px solid #b3d4ff',
      borderRadius: '12px',
      padding: '12px 14px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
    }}
  >
    추천 챌린지 전체 보기
  </button>
</div>


</div>



</div>

  );
}
