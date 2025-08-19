// src/pages/ChallengeList.jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient';
import '../styles/ChallengeList.css';
import CategoryGrid from './CategoryGrid';

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

    // 페이지 진입 시 바디 스크롤 잠금
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || 'auto';
    };
  }, [fetchKeywordTree]);

  

  // handleCategoryClick 함수 수정
  const handleCategoryClick = (categoryId) => {
    if (categoryId === null) {
      // '전체' 버튼을 눌렀을 때, 챌린지 목록 페이지로 이동 (필터 없이)
      navigate(`/challenge/challengeAllList`);
    } else {
      // 카테고리를 눌렀을 때, 해당 카테고리 페이지로 이동
      navigate(`/challenge/category/${categoryId}`);
    }
  };

  const handleCreateClick = () => {
    navigate('/challenge/challengeCreate');
  };


  return (
    <div className="challenge-list-wrapper clean">
      <div className="challenge-list-container">
        <div className="filter-header-section">
          <h2>수련 목록</h2>
          <p>분야별 수련을 찾아보거나, 새로운 수련을 만들어 보시오.</p>
        </div>

        <CategoryGrid
          categories={keywordTree}
          onCategoryClick={handleCategoryClick}
          onCreateClick={handleCreateClick} 
          selectedCategoryId={null}
        />
      </div>

      {/* 플로팅 버튼 계속 쓰고 싶으면 남기고, 카드로만 쓰면 제거해도 됨 */}
      {/* <button className="challenge-list-floating-button fab" onClick={handleCreateClick} aria-label="챌린지 생성">＋</button> */}
    </div>
  );
}
