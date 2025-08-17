import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient';
import ChallengeCard from '../components/ChallengeCard';
import '../styles/ChallengeList.css';

// 카테고리 아이콘 이미지 임포트
import routineIcon from '../../../assets/img/challenge/categoryIcon/ct_routine.png';
import recoveryIcon from '../../../assets/img/challenge/categoryIcon/ct_recovery.png';
import communicationIcon from '../../../assets/img/challenge/categoryIcon/ct_communication.png';
import informationIcon from '../../../assets/img/challenge/categoryIcon/ct_information.png';
import habitIcon from '../../../assets/img/challenge/categoryIcon/ct_habit.png';
import motivationIcon from '../../../assets/img/challenge/categoryIcon/ct_motivation.png';
import selfControlIcon from '../../../assets/img/challenge/categoryIcon/ct_selfcontrol.png';
import stanceIcon from '../../../assets/img/challenge/categoryIcon/ct_stance.png';

// 챌린지 카테고리별 설명 문구
const categoryDescriptions = {
  '1': ['꾸준함의 힘으로 매일 성장하는', '루틴 수련을 둘러보시오.'],
  '2': ['휴식과 재충전으로', '몸과 마음을 다스리는 회복 수련을 둘러보시오.'],
  '3': ['소중한 이들과 마음을 나누는', '소통 수련을 둘러보시오.'],
  '4': ['유용한 팁으로', '수련의 품격을 높이는 정보 수련을 둘러보시오.'],
  '5': ['매일 한 걸음씩 나아가며', '건강한 습관을 들이는 습관 수련을 둘러보시오.'],
  '6': ['불타는 의지로 목표를 향해 달려가는', '동기부여 수련을 둘러보시오.'],
  '7': ['오직 자신에게 집중하며', '심신을 다스리는 자기관리 수련을 둘러보시오.'],
  '8': ['긍정적인 기운을 나누며', '함께 즐기는 분위기 수련을 둘러보시오.'],
};

// 카테고리 ID에 따라 아이콘 경로 매핑
const categoryIcons = {
  '1': routineIcon,
  '2': recoveryIcon,
  '3': communicationIcon,
  '4': informationIcon,
  '5': habitIcon,
  '6': motivationIcon,
  '7': selfControlIcon,
  '8': stanceIcon,
};

export default function ChallengeCategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [challenges, setChallenges] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [keywordTree, setKeywordTree] = useState([]);
  const [selectedKeywordId, setSelectedKeywordId] = useState(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const fabRef = useRef(null);

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

    const descriptionText = useMemo(() => {
    return categoryDescriptions[categoryId] || ['선택한 범주의', '수련들을 확인해보고 힘껏 도전해보시오.'];
    }, [categoryId]);

  const handleFabClick = () => {
    setIsFabOpen(prev => !prev);
  };
  
  const handleKeywordClick = (kwId) => {
    setSelectedKeywordId(prev => (prev === kwId ? null : kwId));
    setIsFabOpen(false);
  };

return (
  <div className="ch-category-page">
    <div className="ch-category-header">
      {/* Icon and Text container */}
      <div className="ch-header-content">
        {categoryId && (
          <div className="ch-category-icon-wrap">
            <img
              src={categoryIcons[categoryId]}
              alt={`${categoryName} 아이콘`}
              className="ch-category-icon"
            />
          </div>
        )}
        <div className="ch-category-text">
          <h2 className="ch-category-title">{categoryName}</h2>
          {descriptionText.map((line, index) => (
            <p key={index} className="ch-category-sub">{line}</p>
          ))}
        </div>
      </div>
      
      {/* Moved keyword filter container into the header */}
      <div className={`ch-category-fab-container ${isFabOpen ? 'open' : ''}`} ref={fabRef}>
        <button className={`ch-category-fab-hash ${isFabOpen ? 'open' : ''}`} onClick={handleFabClick}>
          #
        </button>
        <div className="ch-category-keyword-chips-slide-down">
          {selectedCategory && (
            (selectedCategory?.keywords || []).map((kw, index) => (
              <button
                key={kw.keywordId}
                className={`ch-category-chip ${selectedKeywordId === kw.keywordId ? 'active' : ''}`}
                onClick={() => handleKeywordClick(kw.keywordId)}
                style={{
                  transitionDelay: isFabOpen ? `${index * 0.05}s` : '0s',
                }}
              >
                <span className="ch-category-chip-text">#{kw.keywordName}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
    
    <div className="ch-category-scroll">
      <section className="ch-category-list-container">
        {challengesAfterKeywordFilter.length > 0 ? (
          challengesAfterKeywordFilter.map((challenge) => (
            <ChallengeCard
              key={challenge.challengeId}
              challenge={challenge}
              onClick={() => navigate(`/challenge/detail/${challenge.challengeId}`)}
            />
          ))
        ) : (
          <p className="ch-category-empty-text">등록된 챌린지가 없습니다.</p>
        )}
      </section>
    </div>


  </div>
);
}