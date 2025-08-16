import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useSelector } from "react-redux";
import "../styles/MyPageRoutineCalendar.css"; // ✨ 여기서 예쁜 스타일링
import useRoutineService from "../../routine/service/routineService";
import fireIcon from "../../../assets/img/routine/fire.png"; // 🔥 아이콘
import fireIcon2 from "../../../assets/img/routine/3d-fire.png"; // 🔥 아이콘
import { useNavigate } from "react-router-dom";

export default function MyPageRoutineCalendar() {
  const name = useSelector((state) => state.auth.name);
  const id = useSelector((state) => state.auth.id);

  const routineService = useRoutineService();

  // console.log(name);
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [workoutDates, setWorkoutDates] = useState([]);
  useEffect(() => {
    const fetchWorkoutDates = async () => {
      if (!value) return;

      // 달력 표시 범위 계산 (현재 달력 기준으로 6주 보임)
      const start = new Date(value.getFullYear(), value.getMonth(), 1);
      const end = new Date(value.getFullYear(), value.getMonth() + 1, 0);

      const startStr = start.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];

      try {
        const res = await routineService.getWorkoutDatesBetween(
          id,
          startStr,
          endStr
        );
        const dates = res.data; // ✅ 이미 문자열 배열이라면 그대로 써야 함!
        setWorkoutDates(dates);
      } catch (err) {
        console.error("🔥 날짜 불러오기 실패", err);
      }
    };

    fetchWorkoutDates();
  }, [value, id]);

  const titleContent = ({ date, view, activeStartDate }) => {
    const dateString = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    const isWorkout = workoutDates.includes(dateString);

    const isCurrentMonth =
      date.getMonth() === activeStartDate.getMonth() &&
      date.getFullYear() === activeStartDate.getFullYear();

    return (
      <div className={`day-wrapper ${!isCurrentMonth ? "neighboring" : ""}`}>
        {/* 숫자 */}
        <span>{date.getDate()}</span>

        {/* 불 아이콘 (겹치기) */}
        {isWorkout && (
          <img
            src={fireIcon2}
            alt="운동했음"
            className="fire-icon" // ← 절대배치 스타일은 CSS로!
          />
        )}
      </div>
    );
  };

  const [workoutSummary, setWorkoutSummary] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      const selectedDate = new Date(
        value.getTime() - value.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      console.log("💡 Fetching workout with:", id, selectedDate); // 🔍 로그 확인

      try {
        const response = await routineService.getWorkoutByDate(
          id,
          selectedDate
        );
        console.log("🔥 Got response:", response.data);

        // 요약 저장!
        setWorkoutSummary(response.data.length > 0 ? response.data[0] : null);
      } catch (err) {
        console.error("🔥 날짜 불러오기 실패", err);
      }
    };

    fetchWorkout();
  }, [value]);


  function formatMD(date) {
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${m}/${d}`;
  }
const toLocalYYYYMMDD = (d) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
  return (
    <>
      <div className="divider-line"></div>

      <div className="mypage-container">
        {/* <h5>운동기록</h5> */}

        <div className="calendar-card">
          {" "}
          {/* ← 추가 */}
          <Calendar
            className="routine-calendar"
            onChange={setValue}
            value={value}
            tileContent={titleContent}
            calendarType="gregory"
          />
        </div>

        {/* <div className="workout-result">

  <div className="summary-section">
  <div className="selected-date">
    {value.getMonth() + 1}/{value.getDate()}
  </div>
    <div className="summary-item">
      <i className="ri-heart-line"></i>
      <span>{workoutSummary?.workoutCount ?? 0}개의 운동</span>
    </div>
    <div className="summary-item">
      <i className="ri-timer-line"></i>
      <span>{workoutSummary?.setCount ?? 0}세트</span>
    </div>
    <div className="summary-item">
      <i className="ri-fire-line"></i>
      <span>{workoutSummary?.calories ?? 0}kcal</span>
    </div>
  </div>
</div> */}
<div
  className="workout-bar"
  onClick={() => navigate(`/routine/diary?date=${toLocalYYYYMMDD(value)}`)}
>
          <div className="workout-row">
            {/* col-3 : 날짜 */}
            <div className="col date-col">
              <span className="date-chip">
                {value.getMonth() + 1}/{value.getDate()}
              </span>
            </div>

            {/* col-2 : 운동 개수 */}
            <div className="col kpi-col">
              <i className="ri-heart-line" />
              <span>{workoutSummary?.workoutCount ?? 0}개의 운동</span>
            </div>

            {/* col-2 : 세트 수 */}
            <div className="col kpi-col">
              <i className="ri-timer-line" />
              <span>{workoutSummary?.setCount ?? 0}세트</span>
            </div>

            {/* col-2 : 칼로리 */}
            <div className="col kpi-col">
              <i className="ri-fire-line" />
              <span>{workoutSummary?.calories ?? 0}kcal</span>
            </div>

            <div className="col arrow-col">
              <span>&gt;</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
