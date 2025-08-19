import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/MyPage.css";
import { useNavigate } from "react-router-dom";
import useRoutineService from "../../routine/service/routineService";
import useUserService from '../../../auth/service/userService';;
import fireIcon from "../../../assets/img/routine/fire.png";
import fireIcon2 from "../../../assets/img/routine/3d-fire.png";

const API_BASE_URL = 'http://localhost:8080';

export default function MyPage() {
  const name = useSelector((state) => state.auth.name);
  const id = useSelector((state) => state.auth.id);
  
  const navigate = useNavigate();
  const routineService = useRoutineService();
  const userService = useUserService();

  const [userData, setUserData] = useState(null);
  const [daysSinceSignUp, setDaysSinceSignUp] = useState(0);

  const getWeekRange = () => {
    const now = new Date();
    const day = now.getDay();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - day);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    const toStr = (date) => date.toISOString().split("T")[0];
    return {
      startStr: toStr(sunday),
      endStr: toStr(saturday),
      weekDates: Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        return toStr(d);
      }),
    };
  };

  const [thisWeekWorkoutDates, setThisWeekWorkoutDates] = useState([]);

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        const data = await userService.getUserInfo(id);
        setUserData(data);

        // ✅ 필드 이름을 'createdAt'으로 수정했습니다.
        if (data && data.createdAt) {
          const signUpDate = new Date(data.createdAt);
          if (!isNaN(signUpDate.getTime())) {
            const today = new Date();
            const timeDiff = today.getTime() - signUpDate.getTime();
            const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;
            setDaysSinceSignUp(dayDiff);
          } else {
            console.error("잘못된 날짜 형식입니다:", data.createdAt);
            setDaysSinceSignUp(0);
          }
        }
      } catch (err) {
        console.error("🔥 사용자 정보 로드 실패!", err);
      }

      const { startStr, endStr } = getWeekRange();
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

    if (id) {
      fetchMyPageData();
    }
  }, [id]);

  const getProfileImageUrl = () => {
    if (userData && userData.profileImage) {
      return `${API_BASE_URL}/uploadFiles/${userData.profileImage}`;
    }
    return 'https://placehold.co/100x100?text=No+Image';
  };

  const WeekItem = ({ day, color, isWorkout }) => (
    <div
      style={{
        position: "relative",
        width: "2.5rem",
        height: "2.2rem",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    >
      {isWorkout && (
        <img
          src={fireIcon2}
          alt=""
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 30,
            height: 30,
            transform: "translate(-50%, -50%)",
            opacity: 0.8,
            pointerEvents: "none",
          }}
        />
      )}
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "1.05rem",
          fontWeight: isWorkout ? 700 : 400,
          color,
        }}
      >
        {day}
      </span>
    </div>
  );

  return (
    <div className="mypage-container">
      <div className="profile-box" onClick={() => navigate("/myUserInformation")}>
        <div className="profile-info-wrapper">
          <div className="profile-info">
            <div
              className="profile-img"
              style={{
                backgroundImage: `url(${getProfileImageUrl()})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '50%',
              }}
            />
            <div className="profile-text">
              <div className="username">{userData ? userData.name : ''}님</div>
              <div className="greeting">정진 {daysSinceSignUp}일째</div>
            </div>
          </div>
          <div className="go-arrow">{">"}</div>
        </div>
      </div>

      <div className="each-box">
        <div className="box-header" onClick={() => navigate("/routineCalendar")}>
          <div style={{ fontWeight: 500 }}>이번주 운동 기록</div>
          <span style={{ fontSize: "1.2rem", color: "#888" }}>{">"}</span>
        </div>
        <div className="box-body">
          <div className="week-preview">
            {getWeekRange().weekDates.map((dateStr, i) => {
              const date = new Date(dateStr);
              const day = date.getDate();
              const dayOfWeek = date.getDay();
              const isWorkout = thisWeekWorkoutDates.includes(dateStr);

              let color = "#000";
              if (dayOfWeek === 0) color = "#d04343";
              else if (dayOfWeek === 6) color = "#5630ff";

              return (
                <WeekItem
                  key={i}
                  day={day}
                  color={color}
                  isWorkout={isWorkout}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="each-box">
        <div className="box-header" onClick={() => navigate("/errorPage")}>
          <div style={{ fontWeight: 500 }}>수련장 출첵</div>
          <span style={{ fontSize: "1.2rem", color: "#888" }}>{">"}</span>
        </div>
        <div className="box-body">
          <span style={{ fontSize: "0.9rem", color: "#888" }}>윤수도령 오늘 출첵하셨소?</span>
        </div>
      </div>

      <div className="each-box">
        <div className="box-header" onClick={() => navigate("/errorPage")}>
          <div style={{ fontWeight: 500 }}>장터 관련</div>
          <span style={{ fontSize: "1.2rem", color: "#888" }}>{">"}</span>
        </div>
        <div className="box-body">
          <span style={{ fontSize: "0.9rem", color: "#888" }}>장터관련 내용</span>
        </div>
      </div>
    </div>
  );
}