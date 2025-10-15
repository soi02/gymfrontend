import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/MyPage.css";
import { useNavigate } from "react-router-dom";
import useRoutineService from "../../routine/service/routineService";
import useUserService from '../../../auth/service/userService';
import fireIcon2 from "../../../assets/img/routine/3d-fire.png";

const API_BASE_URL = 'http://localhost:8080';

const getWeekInfo = () => {
    const now = new Date();
    const day = now.getDay();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - day);
  
    const toStr = (date) => date.toISOString().split("T")[0];
  
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        return {
            date: d,
            dateStr: toStr(d),
            dayName: ['일', '월', '화', '수', '목', '금', '토'][d.getDay()],
            isToday: toStr(d) === toStr(now),
        };
    });
  
    return {
        startStr: weekDates[0].dateStr,
        endStr: weekDates[6].dateStr,
        weekDates,
    };
};

const WeekItem = ({ day, dayName, isWorkout }) => (
    <div className="mp-week-item">
        <div className="mp-day-name">{dayName}</div>
        <div className={`mp-day-number ${isWorkout ? 'mp-workout' : ''}`}>
            {isWorkout && <img src={fireIcon2} alt="운동함" className="mp-fire-icon" />}
            <span className="mp-day-text">{day}</span>
        </div>
    </div>
);

export default function MyPage() {
    const id = useSelector((state) => state.auth.id);
    const navigate = useNavigate();
    const routineService = useRoutineService();
    const userService = useUserService();

    const [userData, setUserData] = useState(null);
    const [daysSinceSignUp, setDaysSinceSignUp] = useState(0);
    const [thisWeekWorkoutDates, setThisWeekWorkoutDates] = useState([]);

    useEffect(() => {
        const fetchMyPageData = async () => {
            if (!id) return;
            try {
                const data = await userService.getUserInfo(id);
                setUserData(data);

                if (data && data.createdAt) {
                    const signUpDate = new Date(data.createdAt);
                    if (!isNaN(signUpDate.getTime())) {
                        const today = new Date();
                        const timeDiff = today.getTime() - signUpDate.getTime();
                        const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
                        setDaysSinceSignUp(dayDiff);
                    } else {
                        setDaysSinceSignUp(0);
                    }
                }
            } catch (err) {
                console.error("🔥 사용자 정보 로드 실패!", err);
            }

            const { startStr, endStr } = getWeekInfo();
            try {
                const res = await routineService.getWorkoutDatesBetween(
                    id,
                    startStr,
                    endStr
                );
                setThisWeekWorkoutDates(res.data);
            } catch (err) {
                console.error("🔥 이번 주 운동 불러오기 실패!", err);
            }
        };
    
        fetchMyPageData();
    }, [id]);

    const getProfileImageUrl = () => {
        if (userData && userData.profileImage) {
            return `${API_BASE_URL}/uploadFiles/${userData.profileImage}`;
        }
        return 'https://placehold.co/100x100?text=No+Image';
    };

    return (
        <div className="mp-container">
            {/* <header className="mp-header">
                <h1>마이페이지</h1>
            </header> */}
            <div className="mp-section-container">
                <section className="mp-profile-section" onClick={() => navigate("/mypage/myUserInformation")}>
                    <div className="mp-profile-info">
                        <div className="mp-profile-img" style={{ backgroundImage: `url(${getProfileImageUrl()})` }} />
                        <div className="mp-profile-text">
                            <span className="mp-username">
                                {userData ? userData.name : ''}님,
                            </span>
                            <span className="mp-greeting">
                                안녕하세요!
                            </span>
                            <div className="mp-signup-days">
                                정진 {daysSinceSignUp}일째🔥
                            </div>
                        </div>
                    </div>
                    <div className="mp-go-arrow">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                </section>
                <section className="mp-workout-section">
                    <div className="mp-section-header" onClick={() => navigate("/mypage/routineCalendar")}>
                        <h2 className="mp-section-title">이번주 운동 기록</h2>
                        <div className="mp-go-arrow">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div className="mp-week-preview">
                        {getWeekInfo().weekDates.map((item) => (
                            <WeekItem
                                key={item.dateStr}
                                day={item.date.getDate()}
                                dayName={item.dayName}
                                isWorkout={thisWeekWorkoutDates.includes(item.dateStr)}
                            />
                        ))}
                    </div>
                </section>
                <div className="mp-quick-links">
                    <div className="mp-quick-link-item" onClick={() => navigate("/challenge/challengeMy")}>
                        <span role="img" aria-label="출석체크" className="mp-link-icon">✍️</span>
                        <span className="mp-link-text">수련장 출첵</span>
                    </div>
                    <div className="mp-quick-link-item" onClick={() => navigate("/errorPage")}>
                        <span role="img" aria-label="장터" className="mp-link-icon">🛒</span>
                        <span className="mp-link-text">장터</span>
                    </div>
                    <div className="mp-quick-link-item" onClick={() => navigate("/diary")}>
                        <span role="img" aria-label="일기장" className="mp-link-icon">📖</span>
                        <span className="mp-link-text">일기장</span>
                    </div>
                </div>
                <div className="mp-more-menu-container">
                    <div className="mp-menu-item" onClick={() => navigate("/mypage/notice")}>
                        <span>공지사항</span>
                        <span>{">"}</span>
                    </div>
                    <div className="mp-menu-item">
                        <span>앱 버전</span>
                        <span>1.0.0</span>
                    </div>
                    <div className="mp-menu-item mp-delete" onClick={() => navigate("/errorPage")}>
                        <span style={{ color: '#d04343' }}>회원 탈퇴</span>
                        <span>{">"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}