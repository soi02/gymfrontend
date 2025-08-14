// src/pages/components/CategoryGrid.jsx
import React from 'react';
import '../styles/CategoryGrid.css';

// 1) SVG 묶음 로드
const patternSvgs = import.meta.glob(
  '/src/assets/img/challenge/categorySvg/*.svg',
  { eager: true, as: 'url' }
);

// 이름 매핑(파일명)
const nameToFile = {
  '루틴': 'ct_routine',
  '회복': 'ct_recovery',
  '소통': 'ct_communication',
  '정보': 'ct_information',
  '습관': 'ct_habit',
  '동기부여': 'ct_motivation',
  '자기관리': 'ct_selfcontrol',
  '분위기': 'ct_stance',
};

// 소제목(5~6자 느낌)
const categoryDescriptions = {
  '루틴': '꾸준함의 힘',
  '회복': '휴식과 재충전',
  '소통': '대화와 공감',
  '정보': '유용한 팁',
  '습관': '매일 한걸음씩',
  '동기부여': '불씨 지피기',
  '자기관리': '나를 돌보기',
  '분위기': '수련의 결',
};


// 2) 맵을 “실제 URL”로 구성
const patternMap = {
  '루틴':      patternSvgs['/src/assets/img/challenge/categorySvg/han-fret.svg'],
  '회복':      patternSvgs['/src/assets/img/challenge/categorySvg/han-knot.svg'],
  '소통':      patternSvgs['/src/assets/img/challenge/categorySvg/han-wave.svg'],
  '정보':      patternSvgs['/src/assets/img/challenge/categorySvg/han-candle.svg'],
  '습관':      patternSvgs['/src/assets/img/challenge/categorySvg/han-oct.svg'],
  '동기부여':  patternSvgs['/src/assets/img/challenge/categorySvg/han-ray.svg'],
  '자기관리':  patternSvgs['/src/assets/img/challenge/categorySvg/han-lotus.svg'],
  '분위기':    patternSvgs['/src/assets/img/challenge/categorySvg/han-coin.svg'],
  '전체':    patternSvgs['/src/assets/img/challenge/categorySvg/han-grid.svg'],
};

// const getImagePath = (categoryName) => {
//   const file = nameToFile[categoryName];
//   if (!file) return null;
//   const key = `/src/assets/img/challenge/categoryIcon/${file}.png`;
//   return categoryImages[key] || null;
// };

export default function CategoryGrid({
  categories = [],
  onCategoryClick,
  onCreateClick,
  selectedCategoryId,
}) {
  // '전체'와 '새 챌린지'를 맨 뒤로 이동
  const mainCategories = categories; // 8개
  const lastTwo = [
    { keywordCategoryId: null, keywordCategoryName: '전체', keywordCategoryDescription: '모든 수련', __type: 'all' },
    { __type: 'create' }
  ];

  const allCategories = [...mainCategories, ...lastTwo];

  return (
    <div className="category-grid-wrapper">
      <div className="category-grid">
        {allCategories.map((cat, idx) => {
          // '전체' 버튼 렌더링
          if (cat.__type === 'all') {
            const isSelected = selectedCategoryId === null;
            const allPattern = patternMap['전체'] 
              ?? patternSvgs['/src/assets/img/challenge/categorySvg/han-grid.svg'];

            return (
              <button
                key="all"
                className={`category-item all-card ${isSelected ? 'active' : ''}`}
                onClick={() => onCategoryClick(null)}
                aria-label="전체 수련 목록"
                data-cat="전체"
                style={{
                  '--pattern-url': `url("${allPattern}")`,
                  '--pattern-tint': 'rgba(255,255,255,0.32)',
                  '--pattern-size': '60px',
                }}
              >
                <div className="category-text-container">
                  <span className="category-name">전체</span>
                  <div className="cat-bottom">
                    <p className="category-description">모든 수련</p>
                  </div>
                </div>
                <span className="cat-chevron" aria-hidden="true">›</span>
              </button>
            );
          }

          // '새 챌린지' 버튼
          if (cat.__type === 'create') {
            return (
              <button
                key={`create-${idx}`}
                className="category-item create-card"
                onClick={onCreateClick}
                aria-label="새 챌린지 만들기"
              >
                <div className="create-content">
                  <span className="create-plus">＋</span>
                  <span className="create-text">직접 수련을 만들겠소</span>
                </div>
              </button>
            );
          }

          // 일반 카테고리
          const id = cat.keywordCategoryId ?? cat.id;
          const name = cat.keywordCategoryName ?? cat.name;
          const selected = String(selectedCategoryId) === String(id);
          const patternUrl = patternMap[name] ?? patternSvgs['/src/assets/img/challenge/categorySvg/han-grid.svg'];

          return (
            <button
              key={id}
              className={`category-item ${selected ? 'active' : ''}`}
              onClick={() => onCategoryClick(id)}
              aria-pressed={selected}
              aria-label={`${name} 카테고리 선택`}
              data-cat={name}
              style={{
                '--pattern-url': `url("${patternUrl}")`,
              }}
            >
              <div className="category-text-container">
                <span className="category-name">{name}</span>
                <div className="cat-bottom">
                  <p className="category-description">
                    {categoryDescriptions[name] ?? '추천 코스'}
                  </p>
                </div>
              </div>
              <span className="cat-chevron" aria-hidden="true">›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}