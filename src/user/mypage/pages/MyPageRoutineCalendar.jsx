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
  const navigate = useNavigate();
  // console.log(name);

  const [value, setValue] = useState(new Date());
  const [workoutDates, setWorkoutDates] = useState([]);
  useEffect(() => {
    const fetchWorkoutDates = async () => {
      if (!value) return;

      // 달력 표시 범위 계산 (현재 달력 기준으로 6주 보임)
      const start = new Date(value.getFullYear(), value.getMonth(), 1);
      const end = new Date(value.getFullYear(), value.getMonth() + 1, 0);

      const startStr = toLocalYYYYMMDD(start);
      const endStr = toLocalYYYYMMDD(end);

      try {
        const res = await routineService.getWorkoutDatesBetween(
          id,
          startStr,
          endStr
        );
        const dates = res.data;
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

  // utils
  const toLocalYYYYMMDD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const [workoutSummary, setWorkoutSummary] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      const selectedDate = toLocalYYYYMMDD(value);

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

  console.log("🕒 클라이언트 현재 시간:", new Date());
  console.log("🕒 타임존 오프셋 (분):", new Date().getTimezoneOffset());

  function formatMD(date) {
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${m}/${d}`;
  }

  return (
    <>
      <div className="divider-line"></div>

      <div className="mypage-container">
        {/* 캘린더 */}
        <div className="calendar-card">
          <Calendar
            className="routine-calendar"
            onChange={setValue}
            value={value}
            tileContent={titleContent}
            calendarType="gregory"
          />
        </div>

        {/* 새로운 운동 기록 요약 섹션 */}
        <div className="workout-summary-container">
          <div className="workout-summary-title">
            {value.getMonth() + 1}월 {value.getDate()}일 운동기록
          </div>
          <div className="workout-summary-content">
            {/* 요약 카드 */}
            <div className="summary-card">
              <div className="summary-item">
                <i className="ri-heart-line" />
                <span>{workoutSummary?.workoutCount ?? 0}개 운동</span>
              </div>
              <div className="summary-item">
                <i className="ri-timer-line" />
                <span>{workoutSummary?.setCount ?? 0}세트</span>
              </div>
              <div className="summary-item">
                <i className="ri-fire-line" />
                <span>{workoutSummary?.calories ?? 0}kcal</span>
              </div>
            </div>
            {/* 일지보기 버튼 */}
            <button
              className="view-diary-button"
              onClick={() =>
                navigate(`/routine/diary?date=${toLocalYYYYMMDD(value)}`)
              }
            >
              일지<br/>보기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}