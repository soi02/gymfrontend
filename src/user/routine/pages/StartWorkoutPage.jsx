import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useRoutineService from "../service/routineService";
import { useSwipeable } from "react-swipeable";
import "../styles/StartWorkoutPage.css";
import { useSelector } from "react-redux";

export default function StartWorkoutPage() {
  const { routineId } = useParams();
  const userId = useSelector(state => state.auth.id);

  const [currentIndex, setCurrentIndex] = useState(0);

  const { getFullRoutineDetail, saveActualWorkout } = useRoutineService();
  const [exerciseList, setExerciseList] = useState([]);
  const [routineSets, setRoutineSets] = useState([]);
  const [currentSets, setCurrentSets] = useState([]);
  const currentExercise = exerciseList[currentIndex];
  const [startTime, setStartTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    if (currentExercise) {
      const setsForCurrent = routineSets.filter(set => set.detailId === currentExercise.detailId);
      setCurrentSets(setsForCurrent);
    }
  }, [currentExercise, routineSets]);


  useEffect(() => {
    const fetch = async () => {
      const res = await getFullRoutineDetail(routineId);
      setExerciseList(res.details || []);
      setRoutineSets(res.sets || []);
    };
    fetch();
  }, [routineId]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prev) => Math.min(prev + 1, exerciseList.length - 1)),
    onSwipedRight: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true, // 마우스로도 테스트 가능
  });

  const handleComplete = async () => {
    const now = new Date(); // 종료 시간 (endTime)

    const payload = {
      userId: Number(userId),
      routineId: Number(routineId),
      startTime: startTime?.toISOString(),
      endTime: now.toISOString(),
      details: exerciseList.map((exercise) => {
        const sets = routineSets
          .filter((set) => set.detailId === exercise.detailId && set.done)
          .map(({ kg, reps }) => ({ kg, reps }));

        return {
          elementId: exercise.elementId,
          order: exercise.elementOrder,
          sets
        };
      }).filter(detail => detail.sets.length > 0)
    };

    try {
      const res = await saveActualWorkout(payload); // 백엔드에서 workout + detail + set + log까지 처리!
      console.log("응답: ", res);
      alert("운동 완료! 기록이 저장되었소.");
      navigate(`/gymmadang/routine/result/${res.data.workoutId}`);
    } catch (err) {
      console.error(err);
      alert("저장을 실패하였소.");
    }
  };


  return (
    <div className="main-content">

            <div
            {...handlers} className="start-workout-container">
                <div className="routine-top-bar">
                    <div
                        className="routine-progress-bar"
                    >
                        {exerciseList.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`routine-dot ${currentIndex === idx ? 'active' : ''}`}
                        />
                        ))}
                    </div>
                </div>

                {currentExercise && (
                  <>
                    <div>
                      <img  
                        className="start-workout-image"
                        src={`http://localhost:8080/uploadFiles/${currentExercise.elementPicture}`} />
                      <h3>{`${currentExercise.elementName} (${currentExercise.categoryName})`}</h3>
                    </div>

                    <div className="routine-set-table">
                        {currentSets.map((set, i) => (
                          <div key={i} className="set-row">
                            <span>{i + 1}세트</span>
                            <div className="input-with-unit">
                            <input
                              type="number"
                              value={String(set.kg ?? "")}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsed = value === "" ? "" : parseFloat(value);

                                // ✅ currentSets: 이후 세트까지 동일 값 적용
                                const newCurrentSets = currentSets.map((s, idx) =>
                                  idx >= i ? { ...s, kg: parsed } : s
                                );
                                setCurrentSets(newCurrentSets);

                                // ✅ routineSets도 같이 업데이트
                                const newRoutineSets = routineSets.map((s) =>
                                  s.detailId === currentExercise.detailId && s.setId >= set.setId
                                    ? { ...s, kg: parsed }
                                    : s
                                );
                                setRoutineSets(newRoutineSets);
                              }}
                            />

                              <span className="unit">kg</span>
                            </div>

                            <div className="input-with-unit">
                            <input
                              type="number"
                              value={String(set.reps ?? "")}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsed = value === "" ? "" : parseInt(value);

                                // ✅ currentSets 변경
                                const newCurrentSets = currentSets.map((s, idx) =>
                                  idx >= i ? { ...s, reps: parsed } : s
                                );
                                setCurrentSets(newCurrentSets);

                                // ✅ routineSets 변경
                                const newRoutineSets = routineSets.map((s) =>
                                  s.detailId === currentExercise.detailId && s.setId >= set.setId
                                    ? { ...s, reps: parsed }
                                    : s
                                );
                                setRoutineSets(newRoutineSets);
                              }}
                            />


                              <span className="unit">회</span>
                            </div>

                            <input
                              type="checkbox"
                              checked={set.done || false}
                              onChange={(e) => {
                                const newRoutineSets = [...routineSets];
                                const targetIndex = routineSets.findIndex(
                                  s => s.detailId === currentExercise.detailId && s.setId === set.setId
                                );
                                if (targetIndex !== -1) {
                                  newRoutineSets[targetIndex] = {
                                    ...newRoutineSets[targetIndex],
                                    done: e.target.checked
                                  };
                                  setRoutineSets(newRoutineSets);
                                }
                              }}
                            />


                          </div>
                        ))}
                    </div>
                  </>
                )}
                <div className="routine-complete-btn">
                  <button onClick={handleComplete}>
                    운동 완료
                  </button>
                </div>
                {/* <div style={{ textAlign: "center", marginTop: "1rem" }}>
                    <button disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => i - 1)}>⬅ 이전</button>
                    <button disabled={currentIndex === exerciseList.length - 1} onClick={() => setCurrentIndex((i) => i + 1)}>다음 ➡</button>
                </div> */}
    </div>



    </div>
    
  );
}
