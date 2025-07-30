
import { useLocation } from "react-router-dom";
import "../styles/RoutineAddDetailPage.css"
import { useEffect, useState } from "react";


export default function RoutineAddDetailPage() {

    const location = useLocation();
    const { selectedWorkouts } = location.state || {};


    const [setCount, setSetCount] = useState(4);
    const [sets, setSets] = useState([]);


    const [routineData, setRoutineData] = useState([]);

    useEffect(() => {
        if (selectedWorkouts) {
            const initials = selectedWorkouts.map(w => ({
                elementId: w.elementId,
                elementName: w.elementName,
                sets: Array.from({ length: setCount }, () => ({weight: '', reps: ''}) )
            }));
            setRoutineData(initials);
        }
    }, [selectedWorkouts, setCount]);

    
    const updateSet = (workoutIdx, setIdx, field, value) => {
        setRoutineData(prev => {
            const newData = [...prev];
            newData[workoutIdx].sets[setIdx][field] = value;
            return newData;
        });
    };


    return (
        <>
            <div className="main-content">
                <div className="row">
                    <div className="col" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <h3>루틴 세부설정</h3>
                        <p>
                            운동별 세트 수, 무게, 횟수를 설정해보시오.
                            <br />
                            루틴 저장 후 바로 운동하러 갈 수도 있소.
                        </p>
                    </div>
                </div>

                <div className="row">
                    <div className="col routine-select-row">
                        <label htmlFor="set-select">운동별 세트 수:</label>
                        <select
                            id="set-select"
                            value={setCount}
                            onChange={(e) => setSetCount(parseInt(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>{num}세트</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="routine-scroll-area">
                    {routineData.map((workout, workoutIdx) => (
                        <div key={workout.elementId} className="workout-box">
                            <div className="workout-header">
                                <strong>{workout.elementName}</strong>
                            </div>

                            {workout.sets.map((set, setIdx) => (
                                <div key={setIdx} className="set-row">
                                    <span>{setIdx + 1}세트</span>
                                    <input
                                        type="number"
                                        value={set.weight}
                                        onChange={(e) => updateSet(workoutIdx, setIdx, 'weight', e.target.value)}
                                        placeholder="kg"
                                    />
                                    <span>kg</span>
                                    <input
                                        type="number"
                                        value={set.reps}
                                        onChange={(e) => updateSet(workoutIdx, setIdx, 'reps', e.target.value)}
                                        placeholder="횟수"
                                    />
                                    <span>회</span>
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="sticky-save-btn">
                        {/* <button onClick={handleSave}>루틴 저장하기</button> */}
                        <button >루틴 저장하기</button>
                    </div>
                </div>
            </div>
        </>
    );


}