import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ResultPage.css";
import useRoutineService from "../service/routineService";


export default function ResultPage() {
  const { getActualWorkout } = useRoutineService(); 
  const { workoutId } = useParams();
    console.log("🐛 받아온 workoutId:", workoutId);

  const [workoutList, setWorkoutList] = useState([]);
  const [summary, setSummary] = useState({ totalSets: 0, totalCalories: 0, totalMinutes: 0 });

useEffect(() => {
  if (!workoutId) return;

  const fetchResult = async () => {
    try {
      const { data } = await getActualWorkout(workoutId); // 이거 호출 전에 workoutId가 undefined면 500 떠!
      console.log("🎯 결과 데이터:", data);
      console.log("✅ 타입:", Array.isArray(data)); // true 나와야 해!

      setWorkoutList(data);
    } catch (err) {
      console.error("운동 결과 불러오기 실패 💥", err);
    }
  };

  fetchResult();
}, [workoutId]);




  return (
    <div className="result-page">
      <h4 style={{ textAlign: "center", marginBottom: "1.2rem" }}>
        금일 완료한 운동
      </h4>



      <div className="routine-result-summary-box">
        {Array.from(new Set(workoutList.map(w => w.elementName))).map((name, idx) => {
          const reps = workoutList.find(w => w.elementName === name)?.reps;
          const kg = workoutList.find(w => w.elementName === name)?.kg;
          const count = workoutList.filter(w => w.elementName === name).length;

          return (
            <div key={idx} className="routine-result-summary-row">
              <span>{name}</span>
              <span>{kg}kg x {reps}회 x {count}세트</span>
            </div>
          );
        })}
      </div>

      <div className="routine-result-icons">
        <span>🏋️‍♀️ {summary.totalSets}세트</span>
        <span>🔥 {summary.totalCalories}kcal</span>
        <span>⏱ {summary.totalMinutes.toString().padStart(2, "0")}:00</span>
      </div>


        
      
    </div>
  );
}

