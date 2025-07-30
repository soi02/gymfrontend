import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BuddyHome.css';

export default function BuddyHome() {
    const [buddies, setBuddies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchBuddies = async () => {
            try {
                console.log('fetchBuddies 호출됨');
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8080/api/buddy/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // console.log("응답 전체:", res.data);
                // 수정된 처리 방식
                const processed = res.data.map(user => ({
                    ...user,
                    birthLabel: convertBirth(user.birth),
                    image: user.profile_image
                        ? `http://localhost:8080/uploadFiles/${user.profile_image}`
                        : null,
                }));
                console.log('fetchBuddies 종료');


                setBuddies(processed);
            } catch (error) {
                console.error('버디 정보 불러오기 실패:', error);
            }
        };

        fetchBuddies();
    }, []);

    const convertBirth = (birth) => {
        if (!birth) return '';
        const year = birth.split('-')[0];
        return `(${year.slice(2)}년생)`;
    };

    const handleLike = () => {
        console.log(`${buddies[currentIndex].name}에게 좋아요`);
        moveToNextBuddy();
    };

    const handleDislike = () => {
        console.log(`${buddies[currentIndex].name} 싫어요`);
        moveToNextBuddy();
    };

    const moveToNextBuddy = () => {
        if (currentIndex < buddies.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
            alert("모든 버디를 다 봤어요!");
            // 혹은 setBuddies([]) 로 종료
        }
    };

    if (buddies.length === 0) {
        return <div className="buddy-home-container">버디가 없습니다</div>;
    }

    const buddy = buddies[currentIndex];

    return (
        <div className="buddy-home-container">
            <p className="buddy-home-description">새로운 버디를 만나보세요!</p>

            <div className="buddy-card-wrapper">
                <div className="buddy-card">
                    <img
                        src={buddy.image}
                        alt={buddy.name}
                        className="buddy-card-image"
                        // onError={(e) =>
                        //     (e.target.src = 'https://via.placeholder.com/300x400?text=No+Image')
                        // }
                        onError={(e) => {
                            const fallback = 'https://placehold.co/300x400?text=No+Image';
                            if (e.target.src !== fallback) {
                                e.target.src = fallback;
                            }
                        }}
                        //onerror 는 조건문 안 쓰면 무한 랜더링됨
                    />
                    <div className="buddy-card-info">
                        <h2>{buddy.name}, {buddy.birthLabel}</h2>
                        <p>{buddy.intro || '소개글이 없습니다.'}</p>
                    </div>
                    <div className="buddy-card-actions">
                        <button className="dislike-button" onClick={handleDislike}>❌</button>
                        <button className="like-button" onClick={handleLike}>❤️</button>
                    </div>
                </div>
            </div>
        </div>
    );
}