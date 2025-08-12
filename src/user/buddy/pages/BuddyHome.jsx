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

    const auth = useSelector((state) => state.auth);
    const senderId = auth.id;

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

        fetchBuddies();
    }, []);

    const convertBirth = (birth) => {
        if (!birth) return "";
        const year = birth.split("-")[0];
        return `(${year.slice(2)}년생)`;
    };

    const handleLike = async () => {
        const receiverId = buddies[currentIndex]?.user_id;
        if (!receiverId) return;

        try {
            await axios.post("http://localhost:8080/api/buddy/request", {
                sendBuddyId: senderId,
                receiverBuddyId: receiverId,
            });
            toast.success(`${buddies[currentIndex].name}님에게 호감을 보냈어요 💖`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false, // 막대 보이게
                closeButton: false,     // X 버튼 없애기
                theme: "colored",
            });
        } catch {
            toast.error("호감 요청 실패 😢", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "colored",
            });
        }
        moveToNextBuddy();
    };

    const handleDislike = () => {
        toast.info(`${buddies[currentIndex].name}님을 넘겼어요`, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: true,
            theme: "light",
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

    return (
        <div className="buddy-home-container">
            <div className="buddy-card">
                <img
                    src={buddy.image}
                    alt={buddy.name}
                    className="buddy-card-image"
                    onError={(e) => {
                        const fallback = "https://placehold.co/400x500?text=No+Image";
                        if (e.target.src !== fallback) {
                            e.target.src = fallback;
                        }
                    }}
                />
                <div className="buddy-card-overlay">
                    <div className="buddy-info">
                        <h2>
                            {buddy.name} {buddy.birthLabel}
                        </h2>
                        <p>{buddy.intro || "소개글이 없습니다."}</p>
                    </div>
                    <div className="buddy-actions">
                        <button className="dislike-btn" onClick={handleDislike}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <button className="like-btn" onClick={handleLike}>
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}