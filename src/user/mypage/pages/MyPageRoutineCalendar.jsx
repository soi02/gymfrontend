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
    const [workoutDates, setWorkoutDates] = useState([
    '2025-07-19', '2025-07-22' // 예시: 나중에 DB에서 받아오기
    ])

    const titleContent = ({ date, view, activeStartDate }) => {
    const dateString = date.toISOString().split("T")[0];
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

    const [workoutList, setWorkoutList] = useState([]);

    useEffect(() => {
        const fetchWorkout = async () => {
        const selectedDate = new Date(value.getTime() - (value.getTimezoneOffset() * 60000))
                      .toISOString().split("T")[0];
            
        const response = await routineService.getWorkoutByDate(id, selectedDate);
            //   console.log("🔥 response data:", response);


            setWorkoutList(response.data);

        };

        fetchWorkout();
    }, [value]);









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
                <h3>{value.toLocaleDateString()} 운동 기록</h3>

                {workoutList.length === 0 ? (
                    <p>운동 기록이 없소</p>
                ) : (
                    <ul>
                    {workoutList.map((workout, idx) => (
                        <li key={idx} className="workout-item">
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>


                            <div>
                            <strong>{workout.elementName}</strong>
                            <p>{workout.kg}kg × {workout.reps}회</p>
                            {/* <small>Set ID: {workout.setId}</small> */}
                            </div>
                        </div>
                        </li>
                    ))}
                    </ul>
                )}
                </div>

        </div>
        </div>

    )
}