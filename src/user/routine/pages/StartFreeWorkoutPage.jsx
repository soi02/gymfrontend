import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentExercise = exerciseList[currentIndex];
  const [startTime, setStartTime] = useState(null);
  const [useRestTimer, setUseRestTimer] = useState(true);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [countdown, setCountdown] = useState(60);

// 기본 60초
const [restDuration, setRestDuration] = useState(60);

// 10초 단위 증감 + 최소/최대 클램프
const STEP = 10;
const MIN = 10;
const MAX = 600;
const clamp = (n) => Math.max(MIN, Math.min(MAX, n));
const decRest = () => setRestDuration(v => clamp(v - STEP));
const incRest = () => setRestDuration(v => clamp(v + STEP));

useEffect(() => {
  const v = Number(localStorage.getItem("restDuration"));
  if (Number.isFinite(v) && v > 0) setRestDuration(v);
}, []);
useEffect(() => {
  localStorage.setItem("restDuration", String(restDuration));
}, [restDuration]);


  const currentSets = useMemo(() => {
    if (!currentExercise) return [];
    return routineSets.filter(s => s.elementId === currentExercise.elementId);
  }, [routineSets, currentExercise]);

  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const timerMenuRef = useRef(null);

  useEffect(() => {
    const onClickOutsie = (e) => {
        if (timerMenuRef.current && !timerMenuRef.current.contains(e.target)) {
            setShowTimerMenu(false);
        }
    };
    if (showTimerMenu) document.addEventListener("mousedown", onClickOutsie);
    return () => document.removeEventListener("mousedown", onClickOutsie);
  }, [showTimerMenu]);


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

// ⏱️ 카운트다운 1초마다 감소
useEffect(() => {
  if (!showTimerModal) return;        // 모달 안 켜져 있으면 타이머 off
  if (countdown <= 0) return;         // 0이면 더 이상 감소 X

  const tid = setTimeout(() => {
    setCountdown((c) => c - 1);
  }, 1000);

  return () => clearTimeout(tid);     // 언마운트/리렌더 시 정리
}, [showTimerModal, countdown]);

// ⏱️ 0초가 되면 자동 처치(옵션)
useEffect(() => {
  if (showTimerModal && countdown === 0) {
    // 필요에 따라 알림/소리/진동 넣기
    setShowTimerModal(false);   // 자동 닫기 (원치 않으면 지워도 됨)
    setCountdown(60);           // 다음을 위해 초기화
  }
}, [showTimerModal, countdown]);


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
  if (!currentExercise) return;
  const updated = routineSets.map(set =>
    set.elementId === currentExercise.elementId ? { ...set, done: true } : set
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

  const [showConfirmModal, setShowConfirmModal] = useState(false);


  return (
    <div className="main-content">
        <div className="swp-header">
        <button className="swp-back-btn" onClick={() => navigate(-1)}>&lt;</button>
        <h3 className='swp-header-title'>운동 기록중</h3>
        <button
            className="swp-timer-btn"
            aria-label="휴식 타이머 설정"
            onClick={() => setShowTimerMenu(v => !v)}
        >
          <i className="bi bi-gear"></i>

        </button>
{showTimerMenu && (
  <div ref={timerMenuRef} className="swp-timer-popover">
    <div className="swp-timer-popover-row">
      <span>휴식 타이머</span>
      <label className="routine-switch" style={{ marginLeft: "auto" }}>
        <input
          type="checkbox"
          checked={useRestTimer}
          onChange={(e) => setUseRestTimer(e.target.checked)}
        />
        <span className="routine-slider" />
      </label>
    </div>

    {/* 👇 여기 새로 추가 */}
    <div className="swp-timer-popover-row swp-rest-inline" style={{ marginTop: "0.6rem" }}>
      <button
        type="button"
        className="rest-step"
        onClick={decRest}
        disabled={restDuration <= MIN}
        aria-label="휴식시간 10초 감소"
      >
        −
      </button>
      <span className="rest-value">{restDuration}초</span>
      <button
        type="button"
        className="rest-step"
        onClick={incRest}
        disabled={restDuration >= MAX}
        aria-label="휴식시간 10초 증가"
      >
        ＋
      </button>
    </div>
    {/* 👆 여기까지 */}

    <button className="swp-timer-close" onClick={() => setShowTimerMenu(false)}>
      닫기
    </button>
  </div>
)}

        
        </div>
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

                                // ✅ routineSets만 업데이트 (현재 운동 + 현재세트 이후)
                                const newRoutineSets = routineSets.map((s) =>
                                    s.elementId === currentExercise.elementId && s.setId >= set.setId
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

                                    const newRoutineSets = routineSets.map((s) =>
                                        s.elementId === currentExercise.elementId && s.setId >= set.setId
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
                                    setCountdown(restDuration);
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
                  {/* <button onClick={handleComplete}> */}
                  <button onClick={() => setShowConfirmModal(true)}>
                    🛎️ 오늘은 이만 하기
                  </button>
                  </div>
                </div>




                {/* <div className="routine-rest-timer-toggle">
                  <label className="routine-switch">
                    <input
                      type="checkbox"
                      checked={useRestTimer}
                      onChange={(e) => setUseRestTimer(e.target.checked)}
                    />
                    <span className="routine-slider" />
                  </label>
                  <span className="routine-label-text">휴식 타이머</span>
                </div> */}




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


                {showConfirmModal && (
                <div className="routine-timer-modal">
                    <div className="routine-timer-modal-content">
                    <h5>운동 종료</h5>
                    <p>체크 표시한 운동만 기록됩니다.</p>
                    <p>정말 종료하시겠습니까?</p>
                    <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                    marginTop: "1.5rem"
                    }}>
                        <button
                        className="sfwp-cancel-btn"
                        onClick={() => setShowConfirmModal(false)}
                        >
                        취소
                        </button>
                        <button
                        className="sfwp-confirm-end-btn"
                        onClick={handleComplete}
                        >
                        종료
                        </button>
                    </div>
                    </div>
                </div>
                )}




      </div>
    </div>
  );
}
