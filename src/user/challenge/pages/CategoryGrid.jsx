import React from 'react';

// Vite 환경에서 동적으로 이미지를 불러오기 위한 import.meta.glob 사용
const categoryImages = import.meta.glob('/src/assets/img/challenge/categoryIcon/*.png', { eager: true, as: 'url' });

// 카테고리 이름에 따른 색상 매핑
const categoryColors = {
  '루틴': '#8ABFB5',
  '회복': '#8ABFB5',
  '소통': '#8ABFB5',
  '정보': '#8ABFB5',
  '습관': '#8ABFB5',
  '동기부여': '#8ABFB5',
  '자기관리': '#8ABFB5',
  '분위기': '#8ABFB5',
};
// const categoryColors = {
//   '루틴': '#8ABFB5',
//   '회복': '#F2A766',
//   '소통': '#F2AEB4',
//   '정보': '#B4C4D9',
//   '습관': '#7C1D0D',
//   '동기부여': '#FFB300',
//   '자기관리': '#22BF4F',
//   '분위기': '#001439',
// };

// 🌟 각 카테고리에 대한 설명을 추가했습니다.
const categoryDescriptions = {
  '루틴': '규칙적인 생활',
  '회복': '휴식과 재충전',
  '소통': '대화와 공감',
  '정보': '유용한 팁들',
  '습관': '꾸준한 실천',
  '동기부여': '열정과 목표',
  '자기관리': '나를 돌보기',
  '분위기': '내가 원하는 분위기',
};


const getImagePath = (categoryName) => {
  const nameMapping = {
    '루틴': 'ct_routine',
    '회복': 'ct_recovery',
    '소통': 'ct_communication',
    '정보': 'ct_information',
    '습관': 'ct_habit',
    '동기부여': 'ct_motivation',
    '자기관리': 'ct_selfcontrol',
    '분위기': 'ct_stance',
  };

  const imageName = nameMapping[categoryName];
  if (!imageName) {
    console.error(`Error: No image mapped for category '${categoryName}'`);
    return null;
  }

  const imagePathKey = `/src/assets/img/challenge/categoryIcon/${imageName}.png`;
  const imagePath = categoryImages[imagePathKey];
  
  if (!imagePath) {
    console.error(`Error: Image file not found for path '${imagePathKey}'`);
    return null;
  }

  return imagePath;
};

const CategoryGrid = ({ categories, onCategoryClick, selectedCategoryId }) => {
  return (
    <div className="category-grid">
      {categories.map(cat => (
        <button
          key={cat.keywordCategoryId}
          className={`category-item ${Number(selectedCategoryId) === cat.keywordCategoryId ? 'active' : ''}`}
          onClick={() => onCategoryClick(cat.keywordCategoryId)}
          style={{ backgroundColor: categoryColors[cat.keywordCategoryName] || '#f7f7f7' }}
        >
          <img
            src={getImagePath(cat.keywordCategoryName)}
            alt={cat.keywordCategoryName}
            className="category-icon"
          />
          <div className="category-text-container">
            <span className="category-name">{cat.keywordCategoryName}</span>
            {/* 🌟 설명 p 태그를 추가했습니다. */}
            <p className="category-description">{categoryDescriptions[cat.keywordCategoryName]}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default CategoryGrid;