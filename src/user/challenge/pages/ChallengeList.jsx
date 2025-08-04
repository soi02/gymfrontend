import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient';
import ChallengeCard from '../components/ChallengeCard';
import '../styles/ChallengeList.css';

// 모든 카테고리를 통일된 색상으로 정의합니다.
const unifiedColor = '#E9ECEF';

export default function ChallengeList() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);

  const fetchChallenges = async (categoryId) => {
    try {
      let url;
      if (categoryId === 0) {
        url = 'http://localhost:8080/api/challenge/getAllChallengeListProcess';
      } else {
        url = `http://localhost:8080/api/challenge/getChallengesByCategoryId/${categoryId}`;
      }
      const res = await apiClient.get(url);
      setChallenges(res.data);
    } catch (err) {
      console.error('챌린지 불러오기 실패', err);
      setChallenges([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get('http://localhost:8080/api/challenge/getAllCategories');
      setCategories(res.data);
    } catch (err) {
      console.error('카테고리 불러오기 실패', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId !== 0) {
      fetchChallenges(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(Number(categoryId));
  };
  
  const renderCategoryCubes = () => (
    <div className="row category-row">
      {categories.map((category) => (
        <div key={category.keywordCategoryId} className="col-6 mb-3-se">
          <div
            className="category-cube-se"
            style={{ backgroundColor: unifiedColor }}
            onClick={() => handleCategoryClick(category.keywordCategoryId)}
          >
            <div className="category-cube-text-container">
              <span className="category-cube-name-small-se">챌린지</span>
              <span className="category-cube-name-se">{category.keywordCategoryName}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderChallengeList = () => (
    <>
      <div className="challenge-header">
        <button className="back-button" onClick={() => setSelectedCategoryId(0)}>
          ←
        </button>
        <h2 className="challenge-title">
          {categories.find(c => c.keywordCategoryId === selectedCategoryId)?.keywordCategoryName}
        </h2>
        <div className="search-button">
          <img src="/images/search-icon.svg" alt="Search" />
        </div>
      </div>
      <div className="challenge-cards-list">
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.challengeId}
              challenge={challenge}
              onClick={() => navigate(`/gymmadang/challenge/detail/${challenge.challengeId}`)}
            />
          ))
        ) : (
          <p className="no-challenges-message">등록된 챌린지가 없습니다.</p>
        )}
      </div>
    </>
  );

  return (
    <div className="challenge-list-wrapper">
      <div className="challenge-list-container-se">
        {selectedCategoryId === 0 ? (
          <>
            <h1 className="main-title-se">챌린지</h1>
            <p className="main-subtitle-se">원하는 챌린지를 골라 도전해보세요<br/>재미와 건강, 보상까지 한번에!</p>
            {renderCategoryCubes()}
          </>
        ) : (
          renderChallengeList()
        )}
      </div>
    </div>
  );
}