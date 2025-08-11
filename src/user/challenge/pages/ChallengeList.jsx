// src/pages/ChallengeList.jsx
import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient'; // 기존 apiClient 사용
import ChallengeCard from '../components/ChallengeCard';
import '../styles/ChallengeList.css';
import CategoryGrid from './CategoryGrid';


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
                <div className="filter-header-section">
                    <h2>수련 목록</h2>
                      <p>원하는 챌린지를 골라 도전해보세요</p>
                </div>
                
                {/* 챌린지 카테고리 그리드 컴포넌트 */}
                {/* '전체' 버튼을 제외하고 카테고리 목록만 전달합니다 */}
                <CategoryGrid
                    categories={keywordTree} // keywordTree 상태를 그대로 사용
                    onCategoryClick={handleCategoryClick}
                    selectedCategoryId={selectedCategoryId}
                />

                {/* '전체' 버튼을 별도로 구현하고 싶다면 이 위치에 추가 */}
                {/* <button
                    className={`filter-button ${selectedCategoryId === 0 ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(0)}
                >
                    전체
                </button> */}

                {/* 키워드 필터 (선택된 카테고리일 때만 노출) */}
                {/* 이 부분은 기존 코드 그대로 유지합니다 */}
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

                {/* 챌린지 카드 목록 */}
                {/* 이 부분은 기존 코드 그대로 유지합니다 */}
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