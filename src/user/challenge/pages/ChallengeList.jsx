// src/pages/ChallengeList.jsx
import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient'; // 기존 apiClient 사용
import ChallengeCard from '../components/ChallengeCard';
import '../styles/ChallengeList.css';
import '../styles/ChallengeList.css'; // 필터링 UI 스타일 추가\


export default function ChallengeList() {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    // const [categories, setCategories] = useState([]); // 카테고리 목록 상태
    const [keywordTree, setKeywordTree] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    // const [selectedKeyword, setSelectedKeyword] = useState('');
    const [selectedKeywordId, setSelectedKeywordId] = useState(null); // 단일 키워드 필터


  // 트리 로딩
  const fetchKeywordTree = async () => {
    try {
      const res = await apiClient.get('http://localhost:8080/api/challenge/keywords/tree');
      setKeywordTree(res.data || []);
    } catch (err) {
      console.error('키워드 트리 불러오기 실패', err);
      setKeywordTree([]);
    }
  };


    const fetchChallenges = async (categoryId) => {
        try {
            let url;
            if (categoryId === 0) { // ★ number 0으로 비교
                url = 'http://localhost:8080/api/challenge/list';
            } else {
                url = `http://localhost:8080/api/challenge/getChallengesByCategoryId/${categoryId}`;
            }

            const res = await apiClient.get(url);
            console.log('챌린지 목록', res.data);
            setChallenges(res.data);
        } catch (err) {
            console.error('챌린지 불러오기 실패', err);
            setChallenges([]);
        }
    };

    // 카테고리 목록을 가져오는 함수
    // const fetchCategories = async () => {
    //     try {
    //         // 백엔드에 모든 키워드 카테고리를 조회하는 API가 있다고 가정
    //         const res = await apiClient.get('http://localhost:8080/api/challenge/getAllCategories');
    //         setCategories(res.data);
    //     } catch (err) {
    //         console.error('카테고리 불러오기 실패', err);
    //     }
    // };
    
  useEffect(() => {
    fetchKeywordTree();
  }, []);

  useEffect(() => {
    fetchChallenges(selectedCategoryId);
    setSelectedKeywordId(null); // 카테고리 바꾸면 키워드 초기화
  }, [selectedCategoryId]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(Number(categoryId));
  };

    const selectedCategory = useMemo(
    () => keywordTree.find(c => c.keywordCategoryId === selectedCategoryId),
    [keywordTree, selectedCategoryId]
  );

  const challengesAfterKeywordFilter = useMemo(() => {
    if (!selectedKeywordId) return challenges;
    // 백엔드는 목록 응답에 keywords(이름 배열)를 줌 → 키워드 “이름”으로 비교 필요
    // selectedKeywordId를 이름으로 변환해 필터링
    const keywordName =
      selectedCategory?.keywords?.find(k => k.keywordId === selectedKeywordId)?.keywordName || '';
    if (!keywordName) return challenges;
    return challenges.filter(ch => (ch.keywords || []).includes(keywordName));
  }, [challenges, selectedKeywordId, selectedCategory]);

  return (
    <div className="challenge-list-wrapper">
      <div className="challenge-list-container">
        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: 10 }}>수련 목록</h2>
        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: 20 }}>
          원하는 챌린지를 골라 도전해보세요
        </p>

        {/* 카테고리 필터 */}
        <div className="category-filters">
          <button
            className={`filter-button ${selectedCategoryId === 0 ? 'active' : ''}`}
            onClick={() => handleCategoryClick(0)}
          >
            전체
          </button>
          {keywordTree.map(cat => (
            <button
              key={cat.keywordCategoryId}
              className={`filter-button ${selectedCategoryId === cat.keywordCategoryId ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.keywordCategoryId)}
            >
              {cat.keywordCategoryName}
            </button>
          ))}
        </div>

        {/* 키워드 필터 (선택된 카테고리일 때만 노출) */}
        {selectedCategoryId > 0 && (
          <div className="keyword-filters" style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(selectedCategory?.keywords || []).map(kw => (
              <button
                key={kw.keywordId}
                className={`filter-button ${selectedKeywordId === kw.keywordId ? 'active' : ''}`}
                onClick={() => setSelectedKeywordId(prev => (prev === kw.keywordId ? null : kw.keywordId))}
              >
                #{kw.keywordName}
              </button>
            ))}
          </div>
        )}

        {/* 챌린지 카드 */}
        <div className="challenge-cards-list" style={{ marginTop: 12 }}>
          {challengesAfterKeywordFilter.length > 0 ? (
            challengesAfterKeywordFilter.map((challenge) => (
              <ChallengeCard
                key={challenge.challengeId}
                challenge={challenge}
                onClick={() => navigate(`/gymmadang/challenge/detail/${challenge.challengeId}`)}
              />
            ))
          ) : (
            <p>등록된 챌린지가 없습니다.</p>
          )}
        </div>
      </div>

      <button
        className="challenge-list-floating-button"
        onClick={() => navigate('/gymmadang/challenge/challengeCreate')}
      >
        ＋
      </button>
    </div>
  );
}