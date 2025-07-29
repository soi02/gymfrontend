import React, { useState } from 'react';
import '../styles/ChallengeCreate.css'; // 스타일은 적절히 정리

const keywordData = [
  { category: '루틴', keywords: ['루틴', '스트렝스', '고중량', 'PR갱신', '바디프로필'] },
  { category: '회복', keywords: ['스트레칭', '재활', '부상예방', '마사지볼', '슬로우워크'] },
  { category: '소통', keywords: ['같이해요', '응원해요', '오늘도출첵', '그룹챗', '서로서로'] },
  { category: '정보', keywords: ['자세교정', '식단정보', '초보루틴', '헬스상식', 'PT복습'] },
  { category: '습관', keywords: ['물 2L', '미라클모닝', '일찍자기', '아침 산책'] },
  { category: '동기부여', keywords: ['바디체크', 'Before/After', '체중감량', '미션인증', '기록공유'] },
  { category: '자기관리', keywords: ['헬스노트', '루틴계획', '마이페이스', '한달기록', '나와의약속'] },
  { category: '분위기', keywords: ['조용히혼자', '열정만렙', '따뜻한분위기', '꿀팁공유', '밈과함께'] }
];

export default function StepKeyword({ onNext, onBack }) {
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const toggleKeyword = (keyword) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
    } else if (selectedKeywords.length < 5) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleNext = () => {
    onNext({ challengeKeywordNames: selectedKeywords }); // 키워드 이름 그대로 넘김
  };

  return (
    <div className="challenge-create-page">
      <button className="back-button" onClick={onBack}>←</button>

      <h3 className="challenge-step-title">챌린지 만들기</h3>
      <h2 className="challenge-step-question">
        <strong>{selectedKeywords.length > 0 ? `${selectedKeywords.length}개 선택됨 · ` : ''}키워드를 골라주세요</strong>
      </h2>
      <p className="challenge-step-sub">최대 5개까지 선택할 수 있어요</p>

      <div className="step-keyword-wrapper">
        {keywordData.map((group, index) => (
          <div key={index} className="step-keyword-section">
            <h4 className="step-keyword-category">{group.category}</h4>
            <div className="step-keyword-list">
              {group.keywords.map((keyword) => (
                <button
                  key={keyword}
                  className={`step-keyword-button ${selectedKeywords.includes(keyword) ? 'active' : ''}`}
                  onClick={() => toggleKeyword(keyword)}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="next-button" onClick={handleNext} disabled={selectedKeywords.length === 0}>
        다음
      </button>
    </div>
  );
}
