import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useRoutineService from "../service/routineService";
import { useSwipeable } from "react-swipeable";
import "../styles/StartFreeWorkoutPage.css";

export default function StartFreeWorkoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.id);
  const { getWorkoutList, saveActualWorkout } = useRoutineService();

  const selectedIds = location.state?.selectedIds || [];

  const [exerciseList, setExerciseList] = useState([]);
  const [routineSets, setRoutineSets] = useState([]);
  const [currentSets, setCurrentSets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentExercise = exerciseList[currentIndex];
  const [startTime, setStartTime] = useState(null);
const [useRestTimer, setUseRestTimer] = useState(true);
const [showTimerModal, setShowTimerModal] = useState(false);
const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    setStartTime(new Date());

    const fetch = async () => {
      const all = await getWorkoutList(); // 전체 운동 정보
      const selected = all.filter(el => selectedIds.includes(el.elementId));
      setExerciseList(selected);

      const generatedSets = selected.flatMap((el) => {
        return Array.from({ length: 5 }, (_, i) => ({
          elementId: el.elementId,
          setId: i + 1,
          kg: null,
          reps: null,
          done: false
        }));
      });
      setRoutineSets(generatedSets);
    };

    fetch();
  }, []);

  useEffect(() => {
    if (currentExercise) {
      const setsForCurrent = routineSets.filter(set => set.elementId === currentExercise.elementId);
      setCurrentSets(setsForCurrent);
    }
  }, [currentExercise, routineSets]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prev) => Math.min(prev + 1, exerciseList.length - 1)),
    onSwipedRight: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  // 세트 추가
const handleAddSet = () => {
  if (!currentExercise) return;

  const setsForCurrent = routineSets.filter(set => set.elementId === currentExercise.elementId);
  const lastSet = setsForCurrent[setsForCurrent.length - 1];

  const newSetId = setsForCurrent.length > 0 ? lastSet.setId + 1 : 1;

  const newSet = {
    elementId: currentExercise.elementId,
    setId: newSetId,
    kg: lastSet?.kg ?? null,
    reps: lastSet?.reps ?? null,
    done: false,
  };

  setRoutineSets([...routineSets, newSet]);
};



  // 세트 삭제 (마지막 세트만 삭제)
const handleRemoveSet = () => {
  if (!currentExercise) return;

  const setsForCurrent = routineSets.filter(set => set.elementId === currentExercise.elementId);
  if (setsForCurrent.length <= 1) return;

  const lastSet = setsForCurrent[setsForCurrent.length - 1];

  const newRoutineSets = routineSets.filter(
    set => !(set.elementId === currentExercise.elementId && set.setId === lastSet.setId)
  );

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





  const handleComplete = async () => {
    const now = new Date();

    const payload = {
      userId: Number(userId),
      startTime: startTime?.toISOString(),
      endTime: now.toISOString(),
      details: exerciseList.map(ex => {
        const sets = routineSets
          .filter(set => set.elementId === ex.elementId && set.done)
          .map(({ kg, reps }) => ({ kg, reps }));

        return {
          elementId: ex.elementId,
          order: 0,
          sets
        };
      }).filter(detail => detail.sets.length > 0)
    };

    try {
      const res = await saveActualWorkout(payload);
      alert("운동 완료! 기록이 저장되었소.");
      navigate(`/gymmadang/routine/result/${res.data.workoutId}`);
    } catch (err) {
      console.error(err);
      alert("저장을 실패하였소.");
    }
  };

  return (
    <div className="main-content">
      <div {...handlers} className="start-workout-container">



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
                <div className="image-wrapper-with-arrows">
                  <button
                    className="routine-arrow-button left"
                    onClick={() => setCurrentIndex((i) => i - 1)}
                    disabled={currentIndex === 0}
                    style={{ opacity: currentIndex === 0 ? 0 : 1 }}
                  >
                    &lt;
                  </button>

                  <img
                    className="start-workout-image"
                    src={`http://localhost:8080/uploadFiles/${currentExercise.elementPicture}`}
                    alt={currentExercise.elementName}
                  />

                  <button
                    className="routine-arrow-button right"
                    onClick={() => setCurrentIndex((i) => i + 1)}
                    disabled={currentIndex === exerciseList.length - 1}
                    style={{ opacity: currentIndex === exerciseList.length - 1 ? 0 : 1 }}
                  >
                    &gt;
                  </button>
                </div>

                    <h5 className="start-workout-elementName">{`${currentExercise.elementName} (${currentExercise.categoryName})`}</h5>


                    <div className="routine-set-table">
                        {currentSets.map((set, i) => (
                          <div key={i} className="routine-set-row">
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
                              style={{
                                width: "15px",      
                                height: "15px",
                                transform: "scale(1.4)",
                                cursor: "pointer",  
                                accentColor: "#000000"
                              }}
                              checked={set.done || false}
                                onChange={(e) => {
                                const newRoutineSets = [...routineSets];
                                const targetIndex = routineSets.findIndex(
                                    s => s.elementId === currentExercise.elementId && s.setId === set.setId
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

                <div className="routine-action-buttons">
                  <div className="sfwp-button-row">
                    <button onClick={handleAddSet}>➕ 세트추가</button>
                    <button onClick={handleRemoveSet}>➖ 세트삭제</button>
                    {/* <button onClick={goToNextExercise}>➡ 다음운동</button> */}
                  </div>
                  <div className="sfwp-button-row">
                    <button onClick={handleCompleteAll}>☑️ 모든 세트완료</button>
                  <button onClick={handleComplete}>
                    전체 운동 완료
                  </button>
                  </div>
                </div>




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




                {showTimerModal && (
                  <div className="routine-timer-modal">
                    <div className="routine-timer-modal-content">
                      <p>⏳ 휴식시간: {countdown}초</p>
                      {/* <div className="digital-timer">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                      </div> */}



                      <button
                        className="swo-btn"
                        onClick={() => {
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
