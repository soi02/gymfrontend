import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiClient from '../../../../global/api/apiClient';
import '../styles/GroupChatList.css';


const BACKEND_BASE_URL = 'http://localhost:8080';

// 상대 경로를 절대 URL로 변환하는 함수
function toAbsUrl(path) {
    if (!path) return null;
    // 이미 http:// 또는 https://로 시작하는 완전한 URL이면 그대로 반환
    if (/^https?:\/\//i.test(path)) {
        return path;
    }
    // 상대 경로일 경우 기본 URL과 결합하여 반환
    return `${BACKEND_BASE_URL}${path}`;
}

export default function GroupChatList() {
    const [challenges, setChallenges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // ✅ Redux 스토어에서 사용자 ID를 가져옵니다.
    const userId = useSelector(state => state.auth.id); 

    useEffect(() => {
        // userId가 유효한지 확인합니다.
        if (!userId) {
            setError("로그인이 필요합니다.");
            setIsLoading(false);
            return;
        }

        const fetchJoinedChallenges = async () => {
            try {
                // ✅ 백엔드 API 경로와 userId를 쿼리 파라미터로 전달하여 호출합니다.
                const response = await apiClient.get(`/challenge/getAllMyChallengeListProcess?userId=${userId}`); 
                setChallenges(response.data);
            } catch (err) {
                console.error("참여 중인 챌린지 목록을 불러오는 데 실패했습니다:", err);
                setError("챌린지 목록을 불러올 수 없습니다. 다시 시도해 주세요.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchJoinedChallenges();
    }, [userId]); // ✅ 의존성 배열에 userId를 추가하여, userId가 변경될 때마다 데이터를 다시 불러옵니다.

    const handleChallengeClick = (challengeId) => {
        // `challengeId`를 사용하여 채팅방으로 이동
        navigate(`/challenge/groupchat/${challengeId}`);
    };

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

return (
    <div className="gcl-page"> {/* 인라인 스타일을 제거하고 클래스 이름 적용 */}
        <div className="gcl-topbar">
            <h2 className="gcl-top-title">참여 중인 그룹 채팅</h2>
        </div>
            <div className="gcl-body">
                        {challenges.length > 0 ? (
                            <ul className="gcl-list">
                                {challenges.map(challenge => (
                                    <li
                                        key={challenge.challengeId}
                                        onClick={() => handleChallengeClick(challenge.challengeId)}
                                        className="gcl-card"
                                    >
                                        {challenge.challengeThumbnailPath && (
                                            <img
                                                // 💡 src 속성에 toAbsUrl 함수 적용
                                                src={toAbsUrl(challenge.challengeThumbnailPath)}
                                                alt={challenge.challengeTitle}
                                                className="gcl-thumbnail"
                                            />
                                        )}
                                        <div className="gcl-info">
                                            <h3 className="gcl-title">{challenge.challengeTitle}</h3>
                                            
                                    {challenge.challengeParticipantCount && (
                                        <p className="gcl-members">
                                            참가 인원: {challenge.challengeParticipantCount}명
                                        </p>
                                    )}

                                            <p className="gcl-date">
                                                참여일: {new Date(challenge.personalJoinDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="gcl-empty">참여하고 있는 챌린지가 없습니다.</p>
                        )}
                    </div>
                </div>
            );
}