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
  // 세트 추가
  const handleAddSet = () => {
    if (!currentExercise) return;

    const setsForCurrent = routineSets.filter(set => set.detailId === currentExercise.detailId);

    const lastSet = setsForCurrent[setsForCurrent.length - 1];
    const newSetId = Math.max(...routineSets.map(s => s.setId), 0) + 1;

    const newSet = {
      detailId: currentExercise.detailId,
      setId: newSetId,
      kg: lastSet?.kg ?? null,      // 마지막 세트의 kg
      reps: lastSet?.reps ?? null,  // 마지막 세트의 reps
      done: false,
    };

    setRoutineSets([...routineSets, newSet]);
  };


  // 세트 삭제 (마지막 세트만 삭제)
  const handleRemoveSet = () => {
    if (!currentExercise) return;

    const setsForCurrent = routineSets.filter(set => set.detailId === currentExercise.detailId);
    if (setsForCurrent.length <= 1) return; // 1세트는 최소 보장

    const lastSetId = setsForCurrent[setsForCurrent.length - 1].setId;

    const newRoutineSets = routineSets.filter(set => set.setId !== lastSetId);
    setRoutineSets(newRoutineSets);
  };

  // 모든 세트 완료
  const handleCompleteAll = () => {
    const updated = routineSets.map(set =>
      set.detailId === currentExercise.detailId ? { ...set, done: true } : set
    );
    setRoutineSets(updated);
  };

  // 다음 운동으로 이동
  const goToNextExercise = () => {
    if (currentIndex < exerciseList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const [showTimerModal, setShowTimerModal] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (showTimerModal && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowTimerModal(false);
      setCountdown(60);
    }
  }, [showTimerModal, countdown]);

  const [useRestTimer, setUseRestTimer] = useState(true);

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
                            <div className="routine-input-with-unit">
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

                              <span className="routine-unit">kg</span>
                            </div>

                            <div className="routine-input-with-unit">
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


                              <span className="routine-unit">회</span>
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

                                if (e.target.checked && useRestTimer) {
                                  setShowTimerModal(true);
                                  setCountdown(60);
                                }
                              }}
                            />



                          </div>
                        ))}
                    </div>
                  </>
                )}

                <div className="routine-rest-timer-toggle">
                  <label className="routine-switch">
                    <input
                      type="checkbox"
                      checked={useRestTimer}
                      onChange={(e) => setUseRestTimer(e.target.checked)}
                    />
                    <span className="routine-slider" />
                  </label>
                  <span className="routine-label-text">휴식 타이머</span>
                </div>



                <div className="routine-action-buttons">
                  <div className="sfwp-button-row">
                    <button onClick={handleAddSet}>➕ 세트추가</button>
                    <button onClick={handleRemoveSet}>➖ 세트삭제</button>
                  </div>
                  <div className="sfwp-button-row">
                    <button onClick={handleCompleteAll}>☑️ 모든 세트완료</button>
                    <button onClick={goToNextExercise}>➡ 다음운동</button>
                  </div>
                </div>






                <div className="routine-complete-btn">
                  <button onClick={handleComplete}>
                    전체 운동 완료
                  </button>
                </div>
                {/* <div style={{ textAlign: "center", marginTop: "1rem" }}>
                    <button disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => i - 1)}>⬅ 이전</button>
                    <button disabled={currentIndex === exerciseList.length - 1} onClick={() => setCurrentIndex((i) => i + 1)}>다음 ➡</button>
                </div> */}
                {showTimerModal && (
                  <div className="routine-timer-modal">
                    <div className="timer-modal-content">
                      <p>⏳ 휴식시간: {countdown}초</p>
                      <button onClick={() => {
                        setShowTimerModal(false);
                        setCountdown(60);
                      }}>닫기</button>
                    </div>
                  </div>
                )}

    </div>



    </div>
    
  );
}
