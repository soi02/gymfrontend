import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient';
import ChallengeCard from '../components/ChallengeCard';
import '../styles/ChallengeList.css';

export default function ChallengeCategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [challenges, setChallenges] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [keywordTree, setKeywordTree] = useState([]);
  const [selectedKeywordId, setSelectedKeywordId] = useState(null);

  const fetchKeywordTree = async () => {
    try {
      const res = await apiClient.get('http://localhost:8080/api/challenge/keywords/tree');
      setKeywordTree(res.data || []);
    } catch (err) {
      console.error('키워드 트리 불러오기 실패', err);
      setKeywordTree([]);
    }
  };

  const fetchChallengesByCategory = async () => {
    if (!categoryId) return;
    try {
      const url = `http://localhost:8080/api/challenge/getChallengesByCategoryId/${categoryId}`;
      const res = await apiClient.get(url);
      setChallenges(res.data || []);
    } catch (err) {
      console.error('챌린지 불러오기 실패', err);
      setChallenges([]);
    }
  };

  useEffect(() => {
    fetchKeywordTree();
    fetchChallengesByCategory();
  }, [categoryId]);

  const selectedCategory = useMemo(
    () => keywordTree.find(c => c.keywordCategoryId === Number(categoryId)),
    [keywordTree, categoryId]
  );

  useEffect(() => {
    if (selectedCategory) setCategoryName(selectedCategory.keywordCategoryName);
  }, [selectedCategory]);

  const challengesAfterKeywordFilter = useMemo(() => {
    if (!selectedKeywordId) return challenges;
    const keywordName =
      selectedCategory?.keywords?.find(k => k.keywordId === selectedKeywordId)?.keywordName || '';
    if (!keywordName) return challenges;
    return challenges.filter(ch => (ch.keywords || []).includes(keywordName));
  }, [challenges, selectedKeywordId, selectedCategory]);

  return (
    <div className="challenge-list-wrapper clean">
      <header className="page-header">
        <h1 className="page-title">{categoryName}</h1>
        {/* 고정 위치 키워드 필터(토스 톤: 플랫 칩) */}
        {selectedCategory && (
          <div className="keyword-chips">
            {(selectedCategory?.keywords || []).map(kw => (
              <button
                key={kw.keywordId}
                className={`chip ${selectedKeywordId === kw.keywordId ? 'active' : ''}`}
                onClick={() => setSelectedKeywordId(prev => (prev === kw.keywordId ? null : kw.keywordId))}
              >
                #{kw.keywordName}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* 가로 스크롤 카드 리스트 */}
      <section className="cards-rail">
        {challengesAfterKeywordFilter.length > 0 ? (
          challengesAfterKeywordFilter.map((challenge) => (
            <ChallengeCard
              key={challenge.challengeId}
              challenge={challenge}
              onClick={() => navigate(`/gymmadang/challenge/detail/${challenge.challengeId}`)}
            />
          ))
        ) : (
          <p className="empty-text">등록된 챌린지가 없습니다.</p>
        )}
      </section>

      <button
        className="fab"
        aria-label="챌린지 만들기"
        onClick={() => navigate('/gymmadang/challenge/challengeCreate')}
      >
        ＋
      </button>
    </div>
  );
}
