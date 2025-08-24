import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient';

// 새 레이아웃/카드용 CSS
import '../styles/ChallengeCategoryNew.css';
// FAB은 원래 스타일 유지
import '../styles/ChallengeList.css';

import CategoryChallengeCard from '../components/CategoryChallengeCard';

import routineIcon from '../../../assets/img/challenge/categoryIcon/ct_routine.png';
import recoveryIcon from '../../../assets/img/challenge/categoryIcon/ct_recovery.png';
import communicationIcon from '../../../assets/img/challenge/categoryIcon/ct_communication.png';
import informationIcon from '../../../assets/img/challenge/categoryIcon/ct_information.png';
import habitIcon from '../../../assets/img/challenge/categoryIcon/ct_habit.png';
import motivationIcon from '../../../assets/img/challenge/categoryIcon/ct_motivation.png';
import selfControlIcon from '../../../assets/img/challenge/categoryIcon/ct_selfcontrol.png';
import stanceIcon from '../../../assets/img/challenge/categoryIcon/ct_stance.png';

const categoryDescriptions = {
  '1': ['꾸준함의 힘으로 매일 성장하는', '루틴 수련을 둘러보시오'],
  '2': ['휴식과 재충전으로', '몸과 마음을 다스리는 회복 수련을 둘러보시오'],
  '3': ['소중한 이들과 마음을 나누는', '소통 수련을 둘러보시오'],
  '4': ['유용한 팁으로', '수련의 품격을 높이는 정보 수련을 둘러보시오'],
  '5': ['매일 한 걸음씩 나아가며', '건강한 습관을 들이는 습관 수련을 둘러보시오'],
  '6': ['불타는 의지로 목표를 향해 달려가는', '동기부여 수련을 둘러보시오'],
  '7': ['오직 자신에게 집중하며', '심신을 다스리는 자기관리 수련을 둘러보시오'],
  '8': ['긍정적인 기운을 나누며', '함께 즐기는 분위기 수련을 둘러보시오'],
};

const categoryIcons = {
  '1': routineIcon, '2': recoveryIcon, '3': communicationIcon, '4': informationIcon,
  '5': habitIcon, '6': motivationIcon, '7': selfControlIcon, '8': stanceIcon,
};

export default function ChallengeCategoryPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [challenges, setChallenges] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [keywordTree, setKeywordTree] = useState([]);
  const [selectedKeywordId, setSelectedKeywordId] = useState(null);

  // FAB 상태/참조 (원본 유지)
  const [isFabOpen, setIsFabOpen] = useState(false);
  const fabRef = useRef(null);

  // ----- data fetch -----
  useEffect(() => {
    (async () => {
      try {
        const resTree = await apiClient.get('http://localhost:8080/api/challenge/keywords/tree');
        setKeywordTree(resTree.data || []);
      } catch (err) {
        console.error('키워드 트리 불러오기 실패', err);
        setKeywordTree([]);
      }
      try {
        const resList = await apiClient.get(
          `http://localhost:8080/api/challenge/getChallengesByCategoryId/${categoryId}`
        );
        setChallenges(resList.data || []);
      } catch (err) {
        console.error('챌린지 불러오기 실패', err);
        setChallenges([]);
      }
    })();
  }, [categoryId]);

  const selectedCategory = useMemo(
    () => keywordTree.find(c => c.keywordCategoryId === Number(categoryId)),
    [keywordTree, categoryId]
  );

  useEffect(() => {
    if (selectedCategory) setCategoryName(selectedCategory.keywordCategoryName);
  }, [selectedCategory]);

  const filteredList = useMemo(() => {
    if (!selectedKeywordId) return challenges;
    const kwName =
      selectedCategory?.keywords?.find(k => k.keywordId === selectedKeywordId)?.keywordName || '';
    if (!kwName) return challenges;
    return challenges.filter(ch => (ch.keywords || []).includes(kwName));
  }, [challenges, selectedKeywordId, selectedCategory]);

  const descriptionText = useMemo(() => {
    return categoryDescriptions[categoryId] || ['선택한 범주의', '수련들을 확인해보고 힘껏 도전해보시오.'];
  }, [categoryId]);

  // ----- FAB handlers (원본 유지) -----
  const handleFabClick = () => setIsFabOpen(prev => !prev);
  const handleKeywordClick = (kwId) => {
    setSelectedKeywordId(prev => (prev === kwId ? null : kwId));
    setIsFabOpen(false);
  };

return (
  <div className="ccp-page">
    <header className="ccp-header">
        <div className="ch-category-header">
          <div className="ch-category-icon-wrap">
            {categoryId && (
              <img
                src={categoryIcons[categoryId]}
                alt={`${categoryName} 아이콘`}
                className="ch-category-icon"
              />
            )}
          </div>
          <div className="ch-category-text">
            <h2 className="ch-category-title">{categoryName}</h2>
            {descriptionText.map((line, i) => (
              <p key={i} className="ch-category-sub">{line}</p>
            ))}
          </div>
        </div>

        {/* 헤더에 고정된 FAB */}
        <div className={`ch-category-fab-container ${isFabOpen ? 'open' : ''}`}>
          <button
            className={`ch-category-fab-hash ${isFabOpen ? 'open' : ''}`}
            onClick={handleFabClick}
            aria-label="키워드 필터"
          >
            #
          </button>

          <div className="ch-category-keyword-chips-slide-up">
            {selectedCategory && (selectedCategory?.keywords || []).map((kw, idx) => (
              <button
                key={kw.keywordId}
                className={`ch-category-chip ${selectedKeywordId === kw.keywordId ? 'active' : ''}`}
                onClick={() => handleKeywordClick(kw.keywordId)}
                style={{ transitionDelay: isFabOpen ? `${idx * 0.05}s` : '0s' }}
              >
                <span className="ch-category-chip-text">#{kw.keywordName}</span>
              </button>
            ))}
          </div>
      </div>
    </header>

    {/* 유일한 스크롤러 */}
    <main className="ccp-content">
      <section className="ch-category-list-container">
        {filteredList.length ? (
          filteredList.map((challenge) => (
            <CategoryChallengeCard
              key={challenge.challengeId}
              challenge={challenge}
              onClick={() => navigate(`/challenge/detail/${challenge.challengeId}`)}
            />
          ))
        ) : (
          <p className="ch-category-empty-text">등록된 챌린지가 없습니다.</p>
        )}
      </section>
    </main>
  </div>
);
}
