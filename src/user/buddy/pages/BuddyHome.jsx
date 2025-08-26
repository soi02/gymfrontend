// BuddyHome.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/BuddyHome.css";

export default function BuddyHome() {
    const [buddies, setBuddies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dailyRequests, setDailyRequests] = useState(0);
    const [lastRequestDate, setLastRequestDate] = useState('');

    const auth = useSelector((state) => state.auth);
    const senderId = auth.id;
    
    const MAX_DAILY_REQUESTS = 3;

    useEffect(() => {
        const fetchBuddies = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    "http://localhost:8080/api/buddy/list",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const processed = res.data.map((user) => ({
                    ...user,
                    birthLabel: convertBirth(user.birth), 
                    image: user.profile_image
                        ? `http://localhost:8080/uploadFiles/${user.profile_image}`
                        : null,
                }));

                setBuddies(processed);
            } catch (error) {
                console.error("버디 정보 불러오기 실패:", error);
            }
        };

        const loadDailyRequestCount = () => {
            const today = new Date().toLocaleDateString();
            const savedDate = localStorage.getItem('lastRequestDate');
            const savedCount = localStorage.getItem('dailyRequests');

            if (savedDate === today) {
                setDailyRequests(Number(savedCount) || 0);
                setLastRequestDate(savedDate);
            } else {
                // 새로운 날짜면 초기화
                localStorage.setItem('lastRequestDate', today);
                localStorage.setItem('dailyRequests', '0');
                setDailyRequests(0);
                setLastRequestDate(today);
            }
        };

        fetchBuddies();
        loadDailyRequestCount();
    }, []);

    // 생년월일(YYYY-MM-DD)을 나이로 변환하는 함수 (예시: 만나이 계산 로직 추가 필요)
    const convertBirth = (birth) => {
        if (!birth) return "";
        const today = new Date();
        const birthDate = new Date(birth);
        
        // 간단한 만 나이 계산
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return `(${age}세)`; // 만 나이 표시
    };

   // 토스트 ID를 상수로 정의하여 중복을 방지합니다.
    const SWIPE_TOAST_ID = "swipeToast"; 
    const LIKE_TOAST_ID = "likeToast";

    const handleLike = async () => {
        const receiverId = buddies[currentIndex]?.user_id;
        if (!receiverId) return;

        // 일일 요청 횟수 확인
        if (dailyRequests >= MAX_DAILY_REQUESTS) {
            toast.warning("오늘의 매칭 요청 횟수를 모두 사용했습니다! 내일 다시 시도해주세요.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeButton: false,
                theme: "light",
                toastId: "daily-limit"
            });
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8080/api/buddy/request", {
                sendBuddyId: senderId,
                receiverBuddyId: receiverId,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // 성공 시 요청 횟수 증가
            const newCount = dailyRequests + 1;
            setDailyRequests(newCount);
            localStorage.setItem('dailyRequests', newCount.toString());

            // 성공 토스트 메시지
            toast.success(`${buddies[currentIndex].name}님에게 호감을 보냈어요 💖 (오늘 ${newCount}/3회)`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeButton: false,     
                theme: "light",
                toastId: LIKE_TOAST_ID,
                updateId: LIKE_TOAST_ID,
            });

            moveToNextBuddy();
        } catch {
            toast.error("호감 요청 실패 😢", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "colored",
                toastId: LIKE_TOAST_ID,
                updateId: LIKE_TOAST_ID,
            });
        }
    };

    const handleDislike = () => {
        // 🗑️ 싫어요 토스트: 메시지에서 'X' 관련 특수 문자나 아이콘을 제거하고, 메시지 자체를 깔끔하게 변경합니다.
        toast.info(`${buddies[currentIndex].name}님을 넘겼어요`, {
            position: "top-center",
            autoClose: 1000, 
            hideProgressBar: true,
            theme: "light",
            toastId: SWIPE_TOAST_ID,
            updateId: SWIPE_TOAST_ID,
            // closeButton: false 옵션은 그대로 유지합니다.
        });
        moveToNextBuddy();
    };
    


    const moveToNextBuddy = () => {
        if (currentIndex < buddies.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            toast.info("모든 버디를 다 봤어요!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
            });
        }
    };

    if (!buddies.length) {
        return <div className="buddy-home-container">버디가 없습니다</div>;
    }

    const buddy = buddies[currentIndex];
    const fallbackImage = "https://placehold.co/400x500?text=No+Image";

    return (
        <div className="buddy-home-container">
            <div className="buddy-home-card">
                
                {/* 1. 이미지 컨테이너 (원형) */}
                {/* 이 부분을 다시 첫 번째 수정본의 형태로 되돌립니다. */}
                <div className="buddy-home-profile-circle">
                    <img
                        src={buddy.image || fallbackImage}
                        alt={buddy.name}
                        className="buddy-home-card-image"
                        onError={(e) => {
                            if (e.target.src !== fallbackImage) {
                                e.target.src = fallbackImage;
                            }
                        }}
                    />
                </div>
                
                {/* 2. 콘텐츠 컨테이너 (이름, 소개, 버튼 포함) */}
                <div className="buddy-home-content">
                    <div className="buddy-home-info">
                        {/* 이름 (만 나이) */}
                        <h2 className="buddy-home-name">
                            {buddy.name} {buddy.birthLabel}
                        </h2>
                        {/* 소개 */}
                        <p className="buddy-home-intro">
                            {buddy.intro || "소개글이 없습니다."}
                        </p>
                    </div>

                    {/* 3. 액션 버튼 */}
                    <div className="buddy-home-actions">
                        <button className="buddy-home-dislike-btn" onClick={handleDislike}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <button className="buddy-home-like-btn" onClick={handleLike}>
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}