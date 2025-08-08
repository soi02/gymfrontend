import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useSelector } from "react-redux"
import "../styles/MyPage.css"; // ✨ 여기서 예쁜 스타일링
import { useNavigate } from "react-router-dom";
import useRoutineService from "../../routine/service/routineService";


export default function MyPage() {
  const name = useSelector((state) => state.auth.name);
  const navigate = useNavigate();
  const routineService = useRoutineService();
    const id = useSelector(state => state.auth.id);

  // 🗓 이번 주 일요일 ~ 토요일 범위 구하기
const getWeekRange = () => {
  const now = new Date();
  const day = now.getDay(); // 0(일) ~ 6(토)
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - day); // 이번 주 일요일

  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6); // 이번 주 토요일

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
  const { startStr, endStr } = getWeekRange();

  const fetch = async () => {
    try {
      const res = await routineService.getWorkoutDatesBetween(id, startStr, endStr);
      setThisWeekWorkoutDates(res.data); // 예: ["2025-08-03", "2025-08-04"]
    } catch (err) {
      console.error("🔥 이번 주 운동 불러오기 실패!", err);
    }
  };

  fetch();
}, []);


  return (
    <div className="mypage-container">
      {/* 유저 정보 */}
        <div className="profile-box" onClick={() => navigate("/gymmadang/editProfile")}>
        <div className="profile-info-wrapper">
            <div className="profile-info">
            <div className="profile-img" />
            <div className="profile-text">
                <div className="username">{name}님</div>
                <div className="greeting">정진 223일째</div>
            </div>
            </div>

            <div className="go-arrow">{'>'}</div>
        </div>
        </div>


      {/* 간단 기능 */}
      {/* <div className="quick-buttons">
        <button onClick={() => navigate("/gymmadang/routineCalendar")}>운동 기록</button>
        <button onClick={() => navigate("/gymmadang/routineList")}>내 루틴</button>
        <button onClick={() => navigate("/gymmadang/market")}>중고거래</button>
      </div> */}

<div className="each-box">
  <div className="row-between" onClick={() => navigate("/gymmadang/routineCalendar")}>
    <div>
      <div style={{ fontWeight: 500 }}>이번주 운동 기록</div>
        <div className="week-preview">
        {getWeekRange().weekDates.map((dateStr, i) => {
            const day = new Date(dateStr).getDate(); // 숫자만 뽑기 (4, 5...)
            const isWorkout = thisWeekWorkoutDates.includes(dateStr);

            return (
            <div key={i} style={{ display: 'inline-block', width: '2.2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem' }}>{isWorkout ? '🎖️' : '·'}</div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{day}</div>
            </div>
            );
        })}
        </div>

    </div>
    <span style={{ fontSize: "1.2rem", color: "#888" }}>{'>'}</span>
  </div>
</div>



    </div>
  );
}