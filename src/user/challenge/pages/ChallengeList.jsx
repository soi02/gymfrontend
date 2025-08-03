// src/pages/ChallengeList.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient'; // 기존 apiClient 사용
import ChallengeCard from '../components/ChallengeCard';
import '../styles/ChallengeList.css';
import '../styles/ChallengeList.css'; // 필터링 UI 스타일 추가\


export default function ChallengeList() {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [categories, setCategories] = useState([]); // 카테고리 목록 상태
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);

    const fetchChallenges = async (categoryId) => {
        try {
            let url;
            if (categoryId === 0) { // ★ number 0으로 비교
                url = 'http://localhost:8080/api/challenge/getAllChallengeListProcess';
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
    const fetchCategories = async () => {
        try {
            // 백엔드에 모든 키워드 카테고리를 조회하는 API가 있다고 가정
            const res = await apiClient.get('http://localhost:8080/api/challenge/getAllCategories');
            setCategories(res.data);
        } catch (err) {
            console.error('카테고리 불러오기 실패', err);
        }
    };
    
    // 컴포넌트 마운트 시 카테고리 목록을 가져옵니다.
    useEffect(() => {
        fetchCategories();
    }, []);

    // ★ selectedCategoryId가 변경될 때마다 챌린지 목록을 다시 가져옵니다.
    useEffect(() => {
        fetchChallenges(selectedCategoryId);
    }, [selectedCategoryId]);

    const handleCategoryClick = (categoryId) => {
        // ★ 전달받은 categoryId를 number로 상태에 저장
        setSelectedCategoryId(Number(categoryId));
    };

    return (
        <div className="challenge-list-wrapper">
            <div className="challenge-list-container">
                <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: 10 }}>수련 목록</h2>
                <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: 20 }}>
                    원하는 챌린지를 골라 도전해보세요
                </p>

                {/* 카테고리 필터링 버튼 영역 추가 */}
                <div className="category-filters">
                    <button
                        key="all"
                        className={`filter-button ${selectedCategoryId === 0 ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(0)} // ★ '0'을 숫자로 전달
                    >
                        전체
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.keywordCategoryId} // ★ DTO 필드 이름 변경
                            className={`filter-button ${selectedCategoryId === category.keywordCategoryId ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category.keywordCategoryId)}
                        >
                            {category.keywordCategoryName}
                        </button>
                    ))}
                </div>

                {/* 챌린지 카드 목록 */}
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