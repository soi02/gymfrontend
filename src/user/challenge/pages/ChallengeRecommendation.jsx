// src/user/challenge/pages/ChallengeRecommendation.jsx

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient'; // API 클라이언트 import
import '../styles/TestPage.css'; // 기존 스타일 재사용

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

export default function ChallengeRecommendation() {
  const navigate = useNavigate();
  // Redux 스토어에서 테스트 결과 가져오기
  const { scores, keywords } = useSelector((state) => state.test);

  // ★ 추천 챌린지 목록을 저장할 상태 추가
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);

  // 유효성 검사: 모든 점수가 0이면 테스트 안 한 것
  const hasValidScore = Object.values(scores).some((v) => v > 0);

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

  // ★ 컴포넌트 마운트 시 추천 챌린지 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchRecommendedChallenges = async () => {
      if (!hasValidScore) {
        console.log('⚠️ 유효한 테스트 결과가 없어 추천 챌린지를 불러오지 않습니다.');
        return;
      }
      try {
        const keywordIds = keywords.map(kw => keywordMapping[kw]).filter(id => id);

        console.log("⭐ 전체 추천 API 호출 파라미터:", { keywordIds });
        
        const res = await apiClient.get('/challenge/getRecommendedChallengeListProcess', {
          params: {
            // ★ tendencyId 파라미터를 제거합니다.
            keywordIds: keywordIds.join(',')
          }
        });
        
        console.log('✅ 전체 추천 챌린지 목록', res.data);
        setRecommendedChallenges(res.data);
      } catch (err) {
        console.error('전체 추천 챌린지 불러오기 실패', err);
        setRecommendedChallenges([]);
      }
    };
    fetchRecommendedChallenges();
  }, [hasValidScore, keywords]); // 의존성 배열에서 topType 제거

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

  return (
    <div className="test-page-body">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 className="test-question-title">💡 이런 챌린지는 어때요?</h2>
        <p style={{ fontSize: '14px', color: '#555' }}>
          {labelMap[topType]}인 당신에게 추천하는 챌린지예요!
        </p>
      </div>

      <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: '36px' }}>
        {/* ★ 더미 데이터 대신 API에서 받아온 recommendedChallenges 사용 */}
        {recommendedChallenges.length > 0 ? (
            recommendedChallenges.map((challenge) => (
                <li
                    key={challenge.challengeId}
                    style={{
                        padding: '12px 16px',
                        background: '#f5f5f5',
                        borderRadius: '12px',
                        marginBottom: '10px',
                        fontSize: '15px',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/gymmadang/challenge/detail/${challenge.challengeId}`)}
                >
                    {challenge.challengeTitle}
                </li>
            ))
        ) : (
            <li style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>추천 챌린지가 없습니다.</li>
        )}
      </ul>

      <button
        className="next-button"
        onClick={() => navigate('/gymmadang/challenge/challengeList')}
      >
        챌린지 전체 보러가기
      </button>
    </div>
  );
}