import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiClient from '../../../../global/api/apiClient';

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
        <div style={{ padding: '16px' }}>
            <h2>참여 중인 그룹 채팅</h2>
            {challenges.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {challenges.map(challenge => (
                        <li 
                            key={challenge.challengeId} 
                            onClick={() => handleChallengeClick(challenge.challengeId)}
                            style={{
                                padding: '12px',
                                borderBottom: '1px solid #eee',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {/* 챌린지 썸네일 경로가 있다면 표시 */}
                            {challenge.challengeThumbnailPath && (
                                <img 
                                    src={challenge.challengeThumbnailPath} 
                                    alt={challenge.challengeTitle} 
                                    style={{ width: '60px', height: '60px', marginRight: '16px', borderRadius: '8px', objectFit: 'cover' }}
                                />
                            )}
                            <div style={{ flex: 1 }}>
                                <h3>{challenge.challengeTitle}</h3>
                                <p style={{ color: '#666', fontSize: '12px' }}>
                                    참여일: {new Date(challenge.personalJoinDate).toLocaleDateString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>참여하고 있는 챌린지가 없습니다.</p>
            )}
        </div>
    );
}