import { useState } from "react";
import Calendar from "react-calendar";
import { useSelector } from "react-redux"
import "../styles/MyPageRoutineCalendar.css"; // ✨ 여기서 예쁜 스타일링


export default function MyPageRoutineCalendar() {

    const name = useSelector(state => state.auth.name);
    const id = useSelector(state => state.auth.id);


    console.log(name);

    const [value, setValue] = useState(new Date());
    const [workoutDates, setWorkoutDates] = useState([
    '2025-07-19', '2025-07-22' // 예시: 나중에 DB에서 받아오기
    ])

const titleContent = ({ date }) => {
  const dateString = date.toISOString().split("T")[0];
  const isWorkout = workoutDates.includes(dateString);

  return (
    <>
      {isWorkout && <span className="fire-icon">🔥</span>}
    </>
  );
};





    return(

        <div className="mypage-container">

            {name}님 안녕하세요.
            <Calendar 
                onChange={setValue}
                value={value}
                tileContent={titleContent}
                calendarType="gregory"
                formatDay={(locale, date) => date.getDate()}
            
            />
        </div>

    )
}