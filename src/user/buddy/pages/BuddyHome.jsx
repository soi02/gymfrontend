import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; // ✅ 추가
import '../styles/BuddyHome.css';

export default function BuddyHome() {
    const [buddies, setBuddies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const auth = useSelector(state => state.auth); // ✅ 로그인 정보 가져오기
    const senderId = auth.id;

    useEffect(() => {
        const fetchBuddies = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://172.30.1.74:8443/api/buddy/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const processed = res.data.map(user => ({
                    ...user,
                    birthLabel: convertBirth(user.birth),
                    image: user.profile_image
                        ? `https://172.30.1.74:8443/uploadFiles/${user.profile_image}`
                        : null,
                }));

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

    const handleLike = async () => {
        // const receiverId = buddies[currentIndex].id;
        const receiverId = buddies[currentIndex]?.user_id;
        console.log("currentIndex:", currentIndex);
        console.log("buddies length:", buddies.length);
        console.log("current buddy:", buddies[currentIndex]);

        // const receiverId = buddies[currentIndex]?.id;

        if (!receiverId) {
            console.error("receiverId가 없습니다!");
            return;
        }

        try {
            await axios.post("https://172.30.1.74:8443/api/buddy/request", {
                sendBuddyId: senderId,
                receiverBuddyId: receiverId,
            });

            console.log(`${buddies[currentIndex].name}에게 호감 요청 보냄`);
        } catch (err) {
            console.error("호감 요청 실패:", err);
        }

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
                        onError={(e) => {
                            const fallback = 'https://placehold.co/300x400?text=No+Image';
                            if (e.target.src !== fallback) {
                                e.target.src = fallback;
                            }
                        }}
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