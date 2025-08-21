import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient';
import '../styles/ChallengeListNew.css';

export default function ChallengeList() {
  const navigate = useNavigate();
  const [keywordTree, setKeywordTree] = useState([]);

  const fetchKeywordTree = useCallback(async () => {
    try {
      const res = await apiClient.get('http://localhost:8080/api/challenge/keywords/tree');
      setKeywordTree(res.data || []);
    } catch (err) {
      console.error('키워드 트리 불러오기 실패', err);
      setKeywordTree([]);
    }
  }, []);

  useEffect(() => {
    fetchKeywordTree();
  }, [fetchKeywordTree]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/challenge/category/${categoryId}`);
  };

  const handleCreateClick = () => {
    navigate('/challenge/challengeCreate');
  };

  // 왼/오 컬럼으로 분리 (시각 순서 유지: 0,2,4…는 좌, 1,3,5…는 우)
  const [leftItems, rightItems] = useMemo(() => {
    const left = [], right = [];
    keywordTree.forEach((item, i) => (i % 2 === 0 ? left : right).push(item));
    return [left, right];
  }, [keywordTree]);



  // 파일 상단 (import 아래 아무 곳)
const iconMap = {
  '루틴': '/src/assets/icons/clock.png',       // ⏰
  '회복': '/src/assets/icons/sofa.png',        // 🛋️
  '소통': '/src/assets/icons/chat.png',        // 💬
  '정보': '/src/assets/icons/globe.png',       // 🌐
  '습관': '/src/assets/icons/checklist.png',   // ✅
  '동기부여': '/src/assets/icons/megaphone.png', // 📣
  '자기관리': '/src/assets/icons/shield.png',  // 🛡️
  '분위기': '/src/assets/icons/bell.png',      // 🔔
};

// 매핑에 없으면 인덱스로 아이콘 돌려쓰기 (옵션)
const fallbackIcons = [
  '/src/assets/icons/award.png',
  '/src/assets/icons/phone.png',
  '/src/assets/icons/lock.png',
  '/src/assets/icons/calendar.png',
  '/src/assets/icons/calc.png',
  '/src/assets/icons/arrow.png',
];

const getIconSrc = (name, idx) =>
  iconMap[name] || fallbackIcons[idx % fallbackIcons.length];



  return (
    <div className="cl-new-container">
      <div className="cl-new-header">
        <h1 className="cl-new-title">수련 목록</h1>
        <p className="cl-new-subtitle">분야별 수련을 찾아보거나, 새로운 수련을 만들어 보시오.</p>
      </div>

      <div className="cl-new-grid-2col">
        {/* Left column */}
        <div className="cl-new-col cl-new-col-left">
          {leftItems.map((category, idx) => (
            <div
              key={category.keywordCategoryId}
              className={`cl-new-card cl-new-color-${(idx * 2) + 1}`}
              onClick={() => handleCategoryClick(category.keywordCategoryId)}
            >
              <div className="cl-new-card-content">
                <div className="cl-new-card-head">
                  <img
                    className="cl-new-card-icon"
                    src={getIconSrc(category.keywordCategoryName, idx)}
                    alt=""
                    loading="lazy"
                  />
                  <h2 className="cl-new-card-title">{category.keywordCategoryName}</h2>
                </div>
                <p className="cl-new-card-description">
                  {category.description || '이 카테고리에 대한 설명이 없습니다.'}
                </p>
              </div>
              <div className="cl-new-card-button">자세히 보기</div>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="cl-new-col cl-new-col-right">
          {rightItems.map((category, idx) => (
            <div
              key={category.keywordCategoryId}
              className={`cl-new-card cl-new-color-${(idx * 2) + 2}`}
              onClick={() => handleCategoryClick(category.keywordCategoryId)}
            >
              <div className="cl-new-card-content">
                <div className="cl-new-card-head">
                  <img
                    className="cl-new-card-icon"
                    src={getIconSrc(category.keywordCategoryName, idx)}
                    alt=""
                    loading="lazy"
                  />
                  <h2 className="cl-new-card-title">{category.keywordCategoryName}</h2>
                </div>
                <p className="cl-new-card-description">
                  {category.description || '이 카테고리에 대한 설명이 없습니다.'}
                </p>
              </div>
              <div className="cl-new-card-button">자세히 보기</div>
            </div>
          ))}
        </div>

        {/* 가로 전체폭 Create 카드 */}
        <div className="cl-new-create-card" onClick={handleCreateClick}>
          <div className="cl-new-card-content">
            <h2 className="cl-new-card-title">새로운 수련 만들기</h2>
            <p className="cl-new-card-description">나만의 수련을 시작하고 공유해 보세요!</p>
          </div>
          <div className="cl-new-card-icon">
            <span className="cl-new-plus-icon">+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
