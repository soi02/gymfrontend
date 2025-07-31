import React, { useState } from 'react';
import '../styles/ChallengeCreate.css'; // 스타일은 적절히 정리

const keywordData = [
  { category: '루틴', keywords: [
    { id: 1, name: '루틴' }, { id: 2, name: '스트렝스' }, { id: 3, name: '고중량' },
    { id: 4, name: 'PR갱신' }, { id: 5, name: '바디프로필' }
  ]},
  { category: '회복', keywords: [
    { id: 6, name: '스트레칭' }, { id: 7, name: '재활' }, { id: 8, name: '부상예방' },
    { id: 9, name: '마사지볼' }, { id: 10, name: '슬로우워크' }
  ]},
  { category: '소통', keywords: [
    { id: 11, name: '같이해요' }, { id: 12, name: '응원해요' }, { id: 13, name: '오늘도출첵' },
    { id: 14, name: '그룹챗' }, { id: 15, name: '서로서로' }
  ]},
  { category: '정보', keywords: [
    { id: 16, name: '자세교정' }, { id: 17, name: '식단정보' }, { id: 18, name: '초보루틴' },
    { id: 19, name: '헬스상식' }, { id: 20, name: 'PT복습' }
  ]},
  { category: '습관', keywords: [
    { id: 21, name: '물 2L' }, { id: 22, name: '미라클모닝' }, { id: 23, name: '일찍자기' },
    { id: 24, name: '아침 산책' }
  ]},
  { category: '동기부여', keywords: [
    { id: 25, name: '바디체크' }, { id: 26, name: 'Before/After' }, { id: 27, name: '체중감량' },
    { id: 28, name: '미션인증' }, { id: 29, name: '기록공유' }
  ]},
  { category: '자기관리', keywords: [
    { id: 30, name: '헬스노트' }, { id: 31, name: '루틴계획' }, { id: 32, name: '마이페이스' },
    { id: 33, name: '한달기록' }, { id: 34, name: '나와의약속' }
  ]},
  { category: '분위기', keywords: [
    { id: 35, name: '조용히혼자' }, { id: 36, name: '열정만렙' }, { id: 37, name: '따뜻한분위기' },
    { id: 38, name: '꿀팁공유' }, { id: 39, name: '밈과함께' }
  ]}
];

export default function StepKeyword({ onNext, onBack }) {
  const [selectedKeywordIdList, setSelectedKeywordIdList] = useState([]);

  const toggleKeyword = (id) => {
    if (selectedKeywordIdList.includes(id)) {
      setSelectedKeywordIdList(selectedKeywordIdList.filter((k) => k !== id));
    } else if (selectedKeywordIdList.length < 5) {
      setSelectedKeywordIdList([...selectedKeywordIdList, id]);
    }
  };

  const handleNext = () => {
    const allKeywords = keywordData.flatMap(group => group.keywords);
    const selectedKeywordNames = selectedKeywordIdList.map(id => {
      const keyword = allKeywords.find(k => k.id === id);
      return keyword ? keyword.name : null;
    }).filter(name => name !== null);

    // ★★★ onNext에 전달하는 키 이름을 백엔드 @RequestParam과 동일하게 변경
    onNext({ challengeKeywordNameList: selectedKeywordNames }); 
  };

  const isActive = (id) => selectedKeywordIdList.includes(id);


  return (
    <div className="challenge-create-page">
      <button className="back-button" onClick={onBack}>←</button>

      <h3 className="challenge-step-title">챌린지 만들기</h3>
      <h2 className="challenge-step-question">
        <strong>{selectedKeywordIdList.length > 0 ? `${selectedKeywordIdList.length}개 선택됨 · ` : ''}키워드를 골라주세요</strong>
      </h2>
      <p className="challenge-step-sub">최대 5개까지 선택할 수 있어요</p>

      <div className="step-keyword-wrapper">
        {keywordData.map((group, index) => (
          <div key={index} className="step-keyword-section">
            <h4 className="step-keyword-category">{group.category}</h4>
            <div className="step-keyword-list">
              {group.keywords.map((keyword) => (
                <button
                  key={keyword.id}  // 객체 전체가 아니라 id만 key로 사용
                  className={`step-keyword-button ${isActive(keyword.id) ? 'active' : ''}`}
                  onClick={() => toggleKeyword(keyword.id)}
                >
                  {keyword.name}  
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="next-button" onClick={handleNext} disabled={selectedKeywordIdList.length === 0}>
        다음
      </button>
    </div>
  );
}
