
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/RoutineAddDetailPage.css"
import { useEffect, useState } from "react";
import useRoutineService from "../service/routineService";
import { jwtDecode } from "jwt-decode";


export default function RoutineAddDetailPage() {

    const routineService = useRoutineService();

    const location = useLocation();
    const { selectedWorkouts } = location.state || {};

    const token = localStorage.getItem("token");
    const userId = token ? jwtDecode(token).sub : null;

    const [setCount, setSetCount] = useState(5);

    
const navigate = useNavigate();

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
            const newData = prev.map((workout, wIdx) => {
                if (wIdx === workoutIdx) {
                    const updatedSets = workout.sets.map((set, sIdx) => {
                        // 현재 세트 이후로 전부 동일하게 반영
                        if (sIdx >= setIdx) {
                            return { ...set, [field]: value };
                        }
                        return set;
                    });
                    return { ...workout, sets: updatedSets };
                }
                return workout;
            });
            return newData;
        });
    };



    const removeSet = (workoutIdx, setIdx) => {
        setRoutineData(prev => {
            const newData = prev.map((workout, idx) => {
                if (idx === workoutIdx) {
                    return {
                        ...workout,
                        sets: workout.sets.filter((_, i) => i !== setIdx)
                    };
                }
                return workout;
            });
            return newData;
        });
    };

    const removeWorkout = (workoutIdx) => {
        setRoutineData(prev => prev.filter((_, idx) => idx !== workoutIdx));
    }

        const handleSave = async () => {
        if (!routineName.trim()) {
            alert("루틴 이름을 입력해주시오");
            return;
        }

        if (routineName.length > 10) {
            alert("루틴 이름은 10자 이하로 입력해주시오.");
            return;
        }

        if (routineData.length === 0) {
            alert("운동 항목을 하나 이상 추가해주시오.");
            return;
        }

        const payload = {
            userId: Number(userId),
            routineName: routineName,
            routineDetailList: routineData.map((workout, idx) => ({
                elementId: workout.elementId,
                elementOrder: idx + 1,
                setList: workout.sets.map(set => ({
                    kg: Number(set.weight || 0),
                    reps: Number(set.reps || 0)
                }))
            }))
        };

        console.log("보내는 payload", JSON.stringify(payload, null, 2));

        try {
            await routineService.saveRoutine(payload);
            alert("루틴 저장완료! 바로 운동하러 가보시게.");
            setShowModal(false);
        } catch (error) {
            console.error("저장에러:", error);
            alert("루틴 저장 중 문제가 발생했소.");
        }
    };



    const [showModal, setShowModal] = useState(false);
    const [routineName, setRoutineName] = useState("");


    return (
        <>
        <div className="divider-line" />{/* ← 동일한 상단 라인 */}

            <div className="routine-main-content">
                <div className="row">
                    <div className="col" style={{ paddingTop: "0rem", paddingLeft: "1rem" }}>
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
                        <div key={workout.elementId} className="routine-workout-box">
                            <div className="routine-workout-header">
                                <span>{workout.elementName}</span>
                                <button
                                    className="routine-delete-workout-btn"
                                    onClick={() => removeWorkout(workoutIdx)}
                                    title="운동 항목 삭제"
                                >
                                    <span className="material-symbols-outlined">x</span>
                                </button>
                            </div>

                            {workout.sets.map((set, setIdx) => (
                                <div key={setIdx} className="routine-set-row">
                                    <span>{setIdx + 1}세트</span>
                                    <input
                                        type="number"
                                        value={set.weight}
                                        onChange={(e) => updateSet(workoutIdx, setIdx, 'weight', e.target.value)}
                                    />
                                    <span className="kg-label">kg</span>
                                    <input
                                        type="number"
                                        value={set.reps}
                                        onChange={(e) => updateSet(workoutIdx, setIdx, 'reps', e.target.value)}
                                    />
                                    <span>회</span>
                                    <button
                                        onClick={() => removeSet(workoutIdx, setIdx)}
                                        className="routine-delete-set-btn"
                                        title="세트 삭제"
                                    >
                                        <span className="material-symbols-outlined">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}

                </div>
                <div className="routine-sticky-save-btn">
                    {/* <button onClick={handleSave}>루틴 저장하기</button> */}
                    <button onClick={() => setShowModal(true)}>루틴 저장하기</button>
                </div>
                
                {showModal && (
                    <div className="routine-modal-overlay">
                        <div className="routine-modal-box">
                            <h5>루틴 이름을 입력해주시오.</h5>
                            <input 
                                type="text"
                                value={routineName}
                                onChange={(e) => setRoutineName(e.target.value)}
                                placeholder="예: 하체 부수기"
                            />
                            <div className="routine-modal-btns">
                                <button onClick={() => setShowModal(false)}>취소</button>
                                <button onClick={handleSave}>저장</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );


}