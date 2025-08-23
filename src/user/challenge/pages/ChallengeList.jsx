// src/pages/ChallengeList.jsx
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient';
import '../styles/ChallengeListNew.css';

import routineIcon from '/src/assets/img/challenge/categoryIconNew/routine_new.png';
import recoveryIcon from '/src/assets/img/challenge/categoryIconNew/recovery_new.png';
import commIcon from '/src/assets/img/challenge/categoryIconNew/comm.png';
import infoIcon from '/src/assets/img/challenge/categoryIconNew/info_new.png';
import habitIcon from '/src/assets/img/challenge/categoryIconNew/habit_new.png';
import motivationIcon from '/src/assets/img/challenge/categoryIconNew/motivation_new.png';
import selfIcon from '/src/assets/img/challenge/categoryIconNew/self.png';
import vibeIcon from '/src/assets/img/challenge/categoryIconNew/vibe.png';

export default function ChallengeList() {
  const navigate = useNavigate();
  const [keywordTree, setKeywordTree] = useState([]);

  const fetchKeywordTree = useCallback(async () => {
    try {
      const res = await apiClient.get('http://localhost:8080/api/challenge/keywords/tree');
      setKeywordTree(Array.isArray(res.data) ? res.data : []);
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

  // 왼/오 컬럼 분리 (0,2,4… 좌 / 1,3,5… 우)
  const [leftItems, rightItems] = useMemo(() => {
    const left = [], right = [];
    (keywordTree || []).forEach((item, i) => (i % 2 === 0 ? left : right).push(item));
    return [left, right];
  }, [keywordTree]);

  // 카테고리명 → 아이콘 매핑 (이미지 경로는 프로젝트에 맞게 유지)
  const iconMap = useMemo(() => ({
    '루틴': routineIcon,
    '회복': recoveryIcon,
    '소통': commIcon,
    '정보': infoIcon,
    '습관': habitIcon,
    '동기부여': motivationIcon,
    '자기관리': selfIcon,
    '분위기': vibeIcon,
  }), []);


  const getIconSrc = (name, idx) => iconMap[name] || fallbackIcons[idx % fallbackIcons.length];

  // 카테고리명 → 설명 매핑 (서버에 설명 없을 때 사용)
// 카테고리명 → 단락 설명 매핑
const descMap = {
  '루틴': '꾸준히 지켜가는 <br/>나만의 루틴',
  '회복': '지친 몸과 마음을<br/>회복하는 시간',
  '소통': '함께 교류하는 <br/> 소통의 즐거움',
  '정보': '유용한 정보를 배우고<br/>공유하는 공간',
  '습관': '작은 행동을 모아<br/>만들어가는 습관',
  '동기부여': '서로의 열정을<br/>북돋아주는 힘',
  '자기관리': '스스로 다듬어가는<br/>자기 관리',
  '분위기': '즐거운 기운을<br/>함께 나누는 곳',
};


  const getDesc = (category) =>
    descMap[category?.keywordCategoryName] ||
    (typeof category?.description === 'string' && category.description.trim()) ||
    '이 카테고리에 대한 설명이 없습니다.';

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
              key={category.keywordCategoryId ?? `${category.keywordCategoryName}-${idx}`}
              className={`cl-new-card cl-new-color-${(idx * 2) + 1}`}
              onClick={() => handleCategoryClick(category.keywordCategoryId)}
            >
              {/* 아이콘: 카드 우측 하단 고정 (CSS: .cl-new-card-icon-right) */}
              <img
                className="cl-new-card-icon-right"
                src={getIconSrc(category.keywordCategoryName, idx)}
                alt=""
                loading="lazy"
              />

              {/* 텍스트: 좌측 정렬 */}
              <div className="cl-new-card-content">
                <h2 className="cl-new-card-title">{category.keywordCategoryName}</h2>
                <p
                  className="cl-new-card-description"
                  dangerouslySetInnerHTML={{ __html: getDesc(category) }}
                />
              </div>

              {/* 심플 버튼: > */}
              {/* <div className="cl-new-card-button">&gt;</div> */}
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="cl-new-col cl-new-col-right">
          {rightItems.map((category, idx) => (
            <div
              key={category.keywordCategoryId ?? `${category.keywordCategoryName}-${idx}`}
              className={`cl-new-card cl-new-color-${(idx * 2) + 2}`}
              onClick={() => handleCategoryClick(category.keywordCategoryId)}
            >
              <img
                className="cl-new-card-icon-right"
                src={getIconSrc(category.keywordCategoryName, idx)}
                alt=""
                loading="lazy"
              />
              <div className="cl-new-card-content">
                <h2 className="cl-new-card-title">{category.keywordCategoryName}</h2>
                <p
                  className="cl-new-card-description"
                  dangerouslySetInnerHTML={{ __html: getDesc(category) }}
                />
              </div>
              {/* <div className="cl-new-card-button">&gt;</div> */}
            </div>
          ))}
        </div>

        {/* 가로 전체폭 Create 카드 */}
        <div className="cl-new-create-card" onClick={handleCreateClick}>
          <div className="cl-new-card-content" style={{ textAlign: 'left' }}>
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
