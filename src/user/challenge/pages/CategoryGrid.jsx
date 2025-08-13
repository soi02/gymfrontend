import React from 'react';

// Vite 환경에서 동적으로 이미지를 불러오기 위한 import.meta.glob 사용
const categoryImages = import.meta.glob('/src/assets/img/challenge/categoryIcon/*.png', { eager: true, as: 'url' });

// 카테고리 이름에 따른 색상 매핑
const categoryColors = {
  '루틴': '#fff9e3',
  '회복': '#fff9e3',
  '소통': '#fff9e3',
  '정보': '#fff9e3',
  '습관': '#fff9e3',
  '동기부여': '#fff9e3',
  '자기관리': '#fff9e3',
  '분위기': '#fff9e3',
};
// const categoryColors = {
//   '루틴': '#8ABFB5',
//   '회복': '#F2A766',
//   '소통': '#F2AEB4',
//   '정보': '#216effff',
//   '습관': '#7C1D0D',
//   '동기부여': '#FFB300',
//   '자기관리': '#7f9600ff',
//   '분위기': '#001439',
// };
// const categoryColors = {
//   '루틴': '#8ABFB5',
//   '회복': '#F2A766',
//   '소통': '#F2AEB4',
//   '정보': '#B4C4D9',
//   '습관': '#7C1D0D',
//   '동기부여': '#7f9600ff',
//   '자기관리': '#FFB300',
//   '분위기': '#001439',
// };

// const categoryGradients = {
//   '루틴': 'linear-gradient(135deg, #7C1D0D, #62170a)', // Top Apps
//   '회복': 'linear-gradient(135deg, #7C1D0D, #62170a)', // Top Games
//   '소통': 'linear-gradient(135deg, #7C1D0D, #62170a)', // Social Networking
//   '정보': 'linear-gradient(135deg, #7C1D0D, #62170a)', // Photo & Video
//   '습관': 'linear-gradient(135deg, #B4C4D9, #9ba7be)', // Productivity
//   '동기부여': 'linear-gradient(135deg, #7f9600, #637700)', // Action Games
//   '자기관리': 'linear-gradient(135deg, #FFB300, #e6a200)', // Role Playing Games
//   '분위기': 'linear-gradient(135deg, #001439, #000c25)', // Lifestyle
// };
// const categoryGradients = {
//   '루틴': 'linear-gradient(135deg, #5d69e4, #7983ee)', // Top Apps
//   '회복': 'linear-gradient(135deg, #f4817a, #f3928e)', // Top Games
//   '소통': 'linear-gradient(135deg, #9079f4, #c0a6f8)', // Social Networking
//   '정보': 'linear-gradient(135deg, #f9c268, #f8de95)', // Photo & Video
//   '습관': 'linear-gradient(135deg, #60c4ff, #92d6ff)', // Productivity
//   '동기부여': 'linear-gradient(135deg, #fd8b45, #fdc074)', // Action Games
//   '자기관리': 'linear-gradient(135deg, #a3a3a3, #c8c8c8)', // Role Playing Games
//   '분위기': 'linear-gradient(135deg, #f0646c, #f19a9e)', // Lifestyle
// };

// const categoryGradients = {
//   '루틴': 'linear-gradient(135deg, #8ABFB5, #6a9b93)',
//   '회복': 'linear-gradient(135deg, #F2A766, #e08c4e)',
//   '소통': 'linear-gradient(135deg, #F2AEB4, #e29097)',
//   '정보': 'linear-gradient(135deg, #B4C4D9, #9ba7be)',
//   '습관': 'linear-gradient(135deg, #7C1D0D, #62170a)',
//   '동기부여': 'linear-gradient(135deg, #7f9600, #637700)',
//   '자기관리': 'linear-gradient(135deg, #FFB300, #e6a200)',
//   '분위기': 'linear-gradient(135deg, #001439, #000c25)',
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