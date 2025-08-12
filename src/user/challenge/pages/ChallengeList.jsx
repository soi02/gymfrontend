import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../global/api/apiClient';
import '../styles/ChallengeList.css';
import CategoryGrid from './CategoryGrid';

export default function ChallengeList() {
    const navigate = useNavigate();
    const [keywordTree, setKeywordTree] = useState([]);

    const fetchKeywordTree = async () => {
        try {
            const res = await apiClient.get('http://localhost:8080/api/challenge/keywords/tree');
            setKeywordTree(res.data || []);
        } catch (err) {
            console.error('키워드 트리 불러오기 실패', err);
            setKeywordTree([]);
        }
    };

    useEffect(() => {
        fetchKeywordTree();
    }, []);

    // 카테고리 버튼 클릭 시, 새로운 페이지로 이동하는 함수
    const handleCategoryClick = (categoryId) => {
        // categoryId를 URL 파라미터로 넘겨주면서 이동
        navigate(`/challenge/category/${categoryId}`);
    };

    return (
        <div className="challenge-list-wrapper">
            <div className="challenge-list-container">
                <div className="filter-header-section">
                    <h2>수련 목록</h2>
                    <p>원하는 챌린지를 골라 도전해보세요</p>
                </div>
                
                <CategoryGrid
                    categories={keywordTree}
                    onCategoryClick={handleCategoryClick}
                    selectedCategoryId={null} // 이 페이지에서는 카테고리가 선택되지 않은 상태
                />

                {/* '전체' 버튼을 별도로 추가하고 싶다면 여기에 추가 */}
                {/* <button className="filter-button" onClick={() => navigate('/challenge/list')}>
                    전체
                </button> */}
            </div>

            <button
                className="challenge-list-floating-button"
                onClick={() => navigate('/challenge/challengeCreate')}
            >
                ＋
            </button>
        </div>
    );
}