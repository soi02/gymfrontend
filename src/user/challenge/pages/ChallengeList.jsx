import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient';
import ChallengeCard from '../components/ChallengeCard';
import '../styles/ChallengeList.css';


import routineIcon from '../../../assets/img/challenge/category/routine.png';
import recoveryIcon from '../../../assets/img/challenge/category/recovery.png';
import communicationIcon from '../../../assets/img/challenge/category/communication.png';
import stanceIcon from '../../../assets/img/challenge/category/stance.png';
import informationIcon from '../../../assets/img/challenge/category/information.png';
import selfcontrolIcon from '../../../assets/img/challenge/category/selfcontrol.png';
import motivationIcon from '../../../assets/img/challenge/category/motivation.png';
import habitIcon from '../../../assets/img/challenge/category/habit.png';

// 카테고리별로 적용할 색상 배열을 정의합니다.
const categoryColors = [
  '#fff9e3', // 연회색
  '#fff9e3', // 녹색
  '#fff9e3', // 하늘색
  '#fff9e3', // 노란색
  '#fff9e3', // 연분홍
  '#fff9e3', // 더 연한 회색
  '#fff9e3', // 보라색
  '#fff9e3', // 연한 핑크
];

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
  
// 카테고리 데이터와 아이콘을 매핑하는 배열을 만듭니다.
const categoryData = categories.slice(0, 8).map((category, index) => {
  let icon;
  switch (category.keywordCategoryName) {
    case '루틴': icon = routineIcon; break;
    case '회복': icon = recoveryIcon; break;
    case '소통': icon = communicationIcon; break;
    case '분위기': icon = stanceIcon; break;
    case '정보': icon = informationIcon; break;
    case '자기관리': icon = selfcontrolIcon; break;
    case '동기부여': icon = motivationIcon; break;
    case '습관': icon = habitIcon; break;
    default: icon = null;
  }
  return { ...category, icon: icon };
});


const renderCategoryCubes = () => (
    <div className="circular-layout-container">
        <div className="circular-grid">
            {categoryData.map((category, index) => (
                <div key={category.keywordCategoryId} className={`circular-item item-${index + 1}`}>
                    <div
                        className="category-cube-se with-icon"
                        style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                        onClick={() => handleCategoryClick(category.keywordCategoryId)}
                    >
                        {/* 아이콘을 표시하는 부분 */}
                        <div className="category-cube-icon">
                            {category.icon && <img src={category.icon} alt={category.keywordCategoryName} />}
                        </div>
                        <div className="category-cube-text-container">
                            {/* <span className="category-cube-name-small-se">챌린지</span> */}
                            <span className="category-cube-name-se">{category.keywordCategoryName}</span>
                        </div>
                    </div>
                </div>
            ))}
            <div className="grid-center"></div>
        </div>
        <button
            className="create-challenge-circular-button"
            onClick={() => navigate('/gymmadang/challenge/challengeCreate')}
        >
            새로운 수련을 만들겠소
        </button>
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
          <p className="no-challenges-message">등록된 수련 목록이 없소이다.</p>
        )}
      </div>
    </>
  );

  return (
    <div className="challenge-list-wrapper">
      <div className="challenge-list-container-se">
        {selectedCategoryId === 0 ? (
          <>
            <h1 className="main-title-se">수련 목록</h1>
            <p className="main-subtitle-se">마음에 드는 수련을 택하여 도전하시오.<br/>새로운 수련을 만들고 싶다면, 직접 만드는 것도 가능하오.</p>
            {renderCategoryCubes()}
          </>
        ) : (
          renderChallengeList()
        )}
      </div>
    </div>
  );
}