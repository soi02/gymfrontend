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
//   '습관': 'linear-gradient(135deg,  #7C1D0D, #62170a)', // Productivity
//   '동기부여': 'linear-gradient(135deg,  #7C1D0D, #62170a)', // Action Games
//   '자기관리': 'linear-gradient(135deg,  #7C1D0D, #62170a)', // Role Playing Games
//   '분위기': 'linear-gradient(135deg,  #7C1D0D, #62170a)', // Lifestyle
// };
// const categoryGradients = {
//   '루틴': 'linear-gradient(135deg, #87cffcff, #bbe5ffff)', // Top Apps
//   '회복': 'linear-gradient(135deg, #a0d880ff, rgba(205, 221, 196, 1))', // Top Games
//   '소통': 'linear-gradient(135deg, #cac0f5ff, #baaaffff)', // Social Networking
//   '정보': 'linear-gradient(135deg, #f9c268, #f8de95)', // Photo & Video
//   '습관': 'linear-gradient(135deg, #ffc5caff, #fd8690ff)', // Productivity
//   '동기부여': 'linear-gradient(135deg, #fd8b45, #fdc074)', // Action Games
//   '자기관리': 'linear-gradient(135deg, #c8c8c8, #dbdbdbff)', // Role Playing Games
//   '분위기': 'linear-gradient(135deg, #7e7e7eff, rgba(202, 202, 202, 1))', // Lifestyle
// };
// const categoryGradients = {
//   '루틴': 'linear-gradient(135deg, #34b1ffff, #aedffdff)', // Top Apps
//   '회복': 'linear-gradient(135deg, #ff5b53ff, #f3928e)', // Top Games
//   '소통': 'linear-gradient(135deg, #8970faff, #baaaffff)', // Social Networking
//   '정보': 'linear-gradient(135deg, #f9c268, #f8de95)', // Photo & Video
//   '습관': 'linear-gradient(135deg, #ffc5caff, #fd8690ff)', // Productivity
//   '동기부여': 'linear-gradient(135deg, #fd8b45, #fdc074)', // Action Games
//   '자기관리': 'linear-gradient(135deg, #c8c8c8, #dbdbdbff)', // Role Playing Games
//   '분위기': 'linear-gradient(135deg, #f0646c, #f19a9e)', // Lifestyle
// };
// const categoryGradients = {
//   '루틴': 'linear-gradient(135deg, #FFC0CB, #FFB6C1)', // 벚꽃 핑크
//   '회복': 'linear-gradient(135deg, #FFDAB9, #FFCDBA)', // 밝은 피치
//   '소통': 'linear-gradient(135deg, #B0E0E6, #A2D0D6)', // 청량한 파우더 블루
//   '정보': 'linear-gradient(135deg, #ADD8E6, #9BB6C6)', // 하늘색
//   '습관': 'linear-gradient(135deg, #98FB98, #8DE28D)', // 연한 민트 그린
//   '동기부여': 'linear-gradient(135deg, #FFDEAD, #FFC89C)', // 밝은 오렌지
//   '자기관리': 'linear-gradient(135deg, #E6E6FA, #D8D8E6)', // 연한 라벤더
//   '분위기': 'linear-gradient(135deg, #F08080, #E47474)', // 밝은 코랄 레드
// };

// const categoryGradients = {
//   '루틴': 'linear-gradient(135deg, #A8C0FF, #91A8E0)', // 부드러운 파란색
//   '회복': 'linear-gradient(135deg, #B5B9D0, #A1A5BF)', // 차분한 회색
//   '소통': 'linear-gradient(135deg, #A1B9CC, #90A3BF)', // 청회색
//   '정보': 'linear-gradient(135deg, #D4B9D2, #C2A3C0)', // 은은한 보라색
//   '습관': 'linear-gradient(135deg, #B6D1E7, #A0C0D7)', // 하늘색
//   '동기부여': 'linear-gradient(135deg, #C2C8D6, #B1B8C9)', // 연한 잿빛
//   '자기관리': 'linear-gradient(135deg, #B2A4C2, #A093B3)', // 라벤더 그레이
//   '분위기': 'linear-gradient(135deg, #A2BFCF, #90A9BE)', // 짙은 하늘색
// };

// const categoryGradients = {
//   '루틴': 'linear-gradient(135deg, #FFD460, #FFC045)', // 밝은 노랑
//   '회복': 'linear-gradient(135deg, #FAD689, #E6B54E)', // 톤다운된 노랑
//   '소통': 'linear-gradient(135deg, #90A06D, #7E8C5E)', // 차분한 녹색
//   '정보': 'linear-gradient(135deg, #CC8874, #B87664)', // 부드러운 살구색
//   '습관': 'linear-gradient(135deg, #E6B351, #D9A03A)', // 머스타드
//   '동기부여': 'linear-gradient(135deg, #BF8B5C, #AD7A53)', // 따뜻한 브라운
//   '자기관리': 'linear-gradient(135deg, #C2A570, #B19364)', // 베이지 
//   '분위기': 'linear-gradient(135deg, #E0A77D, #CD976F)', // 코랄
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