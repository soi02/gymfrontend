import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useSelector } from "react-redux"
import "../styles/MyPageRoutineCalendar.css"; // ✨ 여기서 예쁜 스타일링
import useRoutineService from "../../routine/service/routineService";


export default function MyPageRoutineCalendar() {

    const name = useSelector(state => state.auth.name);
    const id = useSelector(state => state.auth.id);

    const routineService = useRoutineService();


    // console.log(name);

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
                const res = await routineService.getWorkoutDatesBetween(id, startStr, endStr);
                const dates = res.data; // ✅ 이미 문자열 배열이라면 그대로 써야 함!
                setWorkoutDates(dates);

            } catch (err) {
            console.error("🔥 날짜 불러오기 실패", err);
            }
        };

        fetchWorkoutDates();
        }, [value, id]);


    const titleContent = ({ date, view, activeStartDate }) => {
const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                    .toISOString().split("T")[0];
    const isWorkout = workoutDates.includes(dateString);

    // 표시 중인 달과 일치하는지 비교
    const isCurrentMonth = date.getMonth() === activeStartDate.getMonth() &&
                            date.getFullYear() === activeStartDate.getFullYear();

    return (
        <div className={`day-wrapper ${!isCurrentMonth ? "neighboring" : ""}`}>
        <span>{date.getDate()}</span>
        {isWorkout && <span className="fire-icon">🔥</span>}
        </div>
    );
    };

    const [workoutSummary, setWorkoutSummary] = useState(null);


useEffect(() => {
const fetchWorkout = async () => {
  const selectedDate = new Date(value.getTime() - (value.getTimezoneOffset() * 60000))
                      .toISOString().split("T")[0];

  console.log("💡 Fetching workout with:", id, selectedDate); // 🔍 로그 확인

  try {
    const response = await routineService.getWorkoutByDate(id, selectedDate);
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







    return(
            <div
                className="main-content"
                style={{ height: "100vh", display: "flex", flexDirection: "column" }}
            >
        <div className="mypage-container">

            {/* {name}님 안녕하세요. */}
            <Calendar 
                onChange={setValue}
                value={value}
                tileContent={titleContent}
                calendarType="gregory"
                // formatDay={(locale, date) => date.getDate()}
            
            />

            <div className="workout-result">
                <h5>{value.toLocaleDateString()} 운동 기록</h5>

                {!workoutSummary ? (
                    <p>운동 기록이 없소</p>
                ) : (
                    <ul>
                        {workoutSummary && (
                        <div className="summary-section">
                            {/* <h4>운동 요약</h4> */}
                            <p>운동 종목 수: {workoutSummary.workoutCount}개</p>
                            <p>소모 칼로리: {workoutSummary.calories} kcal</p>
                            <p>운동 시간: {workoutSummary.workoutTime}분</p>
                        </div>
                        )}

                    </ul>
                )}
                </div>

        </div>
        </div>

    )
}