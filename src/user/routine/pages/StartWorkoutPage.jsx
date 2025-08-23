import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useRoutineService from "../service/routineService";
import { useSwipeable } from "react-swipeable";
import "../styles/StartWorkoutPage.css";
import { useSelector } from "react-redux";
import clock from "../../../assets/img/routine/clock.png";

export default function StartWorkoutPage() {
  const { routineId } = useParams();
  const userId = useSelector((state) => state.auth.id);

  const [currentIndex, setCurrentIndex] = useState(0);

  const { getFullRoutineDetail, saveActualWorkout } = useRoutineService();
  const [exerciseList, setExerciseList] = useState([]);
  const [routineSets, setRoutineSets] = useState([]);
  const [currentSets, setCurrentSets] = useState([]);
  const currentExercise = exerciseList[currentIndex];
  const [startTime, setStartTime] = useState(null);
  const navigate = useNavigate();
  const timerMenuRef = useRef(null);


// ✅ 기본 60초 — deps에서 쓰이므로 여기(위쪽)에 선언해야 함
const [restDuration, setRestDuration] = useState(60);

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    if (currentExercise) {
      const setsForCurrent = routineSets.filter(
        (set) => set.detailId === currentExercise.detailId
      );
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
    onSwipedLeft: () =>
      setCurrentIndex((prev) => Math.min(prev + 1, exerciseList.length - 1)),
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
      details: exerciseList
        .map((exercise) => {
          const sets = routineSets
            .filter((set) => set.detailId === exercise.detailId && set.done)
            .map(({ kg, reps }) => ({ kg, reps }));

          return {
            elementId: exercise.elementId,
            order: exercise.elementOrder,
            sets,
          };
        })
        .filter((detail) => detail.sets.length > 0),
    };

    try {
      const res = await saveActualWorkout(payload);
      alert("운동 완료! 기록이 저장되었소.");
      navigate(`/routine/result/${res.data.workoutId}`);
    } catch (err) {
      console.error(err);
      alert("저장을 실패하였소.");
    }
  };
  // 세트 추가
  const handleAddSet = () => {
    if (!currentExercise) return;

    const setsForCurrent = routineSets.filter(
      (set) => set.detailId === currentExercise.detailId
    );

    const lastSet = setsForCurrent[setsForCurrent.length - 1];
    const newSetId = Math.max(...routineSets.map((s) => s.setId), 0) + 1;

    const newSet = {
      detailId: currentExercise.detailId,
      setId: newSetId,
      kg: lastSet?.kg ?? null, // 마지막 세트의 kg
      reps: lastSet?.reps ?? null, // 마지막 세트의 reps
      done: false,
    };

    setRoutineSets([...routineSets, newSet]);
  };

  // 세트 삭제 (마지막 세트만 삭제)
  const handleRemoveSet = () => {
    if (!currentExercise) return;

    const setsForCurrent = routineSets.filter(
      (set) => set.detailId === currentExercise.detailId
    );
    if (setsForCurrent.length <= 1) return; // 1세트는 최소 보장

    const lastSetId = setsForCurrent[setsForCurrent.length - 1].setId;

    const newRoutineSets = routineSets.filter((set) => set.setId !== lastSetId);
    setRoutineSets(newRoutineSets);
  };

  // 모든 세트 완료
  const handleCompleteAll = () => {
    const updated = routineSets.map((set) =>
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
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  } else if (countdown === 0) {
    setShowTimerModal(false);
    setCountdown(restDuration); // 0초 끝나면 닫고 기본값으로
    if (navigator.vibrate) navigator.vibrate(200); // 선택: 진동 알림
  }
}, [showTimerModal, countdown, restDuration]);


  const [useRestTimer, setUseRestTimer] = useState(true);




  const [showMenu, setShowMenu] = useState(false); 
  const [showTimerMenu, setShowTimerMenu] = useState(false);

  // 기본 60초

  // 10초 단위 증감 + 최소/최대 클램프
  const STEP = 10;
  const MIN = 10;
  const MAX = 600;
  const clamp = (n) => Math.max(MIN, Math.min(MAX, n));
  const decRest = () => setRestDuration((v) => clamp(v - STEP));
  const incRest = () => setRestDuration((v) => clamp(v + STEP));

  useEffect(() => {
    const v = Number(localStorage.getItem("restDuration"));
    if (Number.isFinite(v) && v > 0) setRestDuration(v);
  }, []);
  useEffect(() => {
    localStorage.setItem("restDuration", String(restDuration));
  }, [restDuration]);

  useEffect(() => {
    const onClickOutsie = (e) => {
      if (timerMenuRef.current && !timerMenuRef.current.contains(e.target)) {
        setShowTimerMenu(false);
      }
    };
    if (showTimerMenu) document.addEventListener("mousedown", onClickOutsie);
    return () => document.removeEventListener("mousedown", onClickOutsie);
  }, [showTimerMenu]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);


  return (
    <div className="swp-main-content">
      <div {...handlers} className="start-workout-container">
        <div className="swp-header">
        <button className="swp-back-btn" onClick={() => navigate(-1)}>&lt;</button>
        <h3 className='swp-header-title'>나의 루틴: 기록중</h3>
        <button
            className="swp-timer-btn"
            aria-label="휴식 타이머 설정"
            onClick={() => setShowTimerMenu(v => !v)}
        >
        <img
          src={clock}
          alt="휴식 타이머"
          style={{ width: "22px", height: "22px"}}
        >
        </img>
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

            <button className="swp-timer-close" onClick={() => setShowTimerMenu(false)}>
              설정 완료
            </button>
          </div>
        )}

        
        </div>

        <div className="routine-top-bar">
          <div className="routine-progress-bar">
            {exerciseList.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`routine-dot ${
                  currentIndex === idx ? "active" : ""
                }`}
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
                style={{
                  opacity: currentIndex === exerciseList.length - 1 ? 0 : 1,
                }}
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
                          s.detailId === currentExercise.detailId &&
                          s.setId >= set.setId
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
                          s.detailId === currentExercise.detailId &&
                          s.setId >= set.setId
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
                      accentColor: "#000000",
                    }}
                    checked={set.done || false}
                    onChange={(e) => {
                      const newRoutineSets = [...routineSets];
                      const targetIndex = routineSets.findIndex(
                        (s) =>
                          s.detailId === currentExercise.detailId &&
                          s.setId === set.setId
                      );
                      if (targetIndex !== -1) {
                        newRoutineSets[targetIndex] = {
                          ...newRoutineSets[targetIndex],
                          done: e.target.checked,
                        };
                        setRoutineSets(newRoutineSets);
                      }

                      // ✅ 설정한 휴식시간으로 타이머 시작
                      if (e.target.checked && useRestTimer) {
                        setShowTimerModal(true);
                        setCountdown(restDuration); // ← 여기!
                      }
                    }}

                  />
                </div>
              ))}

              <div className="sfwp-button-row">
                <button
                  type="button"
                  className="sfwp-btn sfwp-btn-add"
                  onClick={handleAddSet}
                  aria-label="세트 추가"
                >
                  <span className="icon" aria-hidden>
                    ＋
                  </span>
                  세트추가
                </button>

                <button
                  type="button"
                  className="sfwp-btn sfwp-btn-del"
                  onClick={handleRemoveSet}
                  disabled={currentSets.length <= 1} // 1세트 이하일 땐 삭제 비활성화
                  aria-label="세트 삭제"
                >
                  <span className="icon" aria-hidden>
                    −
                  </span>
                  세트삭제
                </button>
              </div>
            </div>
          </>
        )}

        {/* 고정 하단 액션 */}
        <div className="sfwp-fixed-actions">
          <div className="sfwp-button-row">
            <button
              type="button"
              className="sfwp-btn-2 sfwp-btn-done"
              onClick={handleCompleteAll}
            >
              현재 운동 완료
            </button>

            <button
              type="button"
              className="sfwp-btn-2 sfwp-btn-finish"
              onClick={() => setShowConfirmModal(true)}
            >
              모든 운동 완료
            </button>
          </div>
        </div>
{showTimerModal && (
  <div className="timer-overlay" role="dialog" aria-modal="true" onClick={() => {
    setShowTimerModal(false);
    setCountdown(restDuration);
  }}>
    <div
      className="timer-card"
      onClick={(e) => e.stopPropagation()}
      aria-label={`휴식 ${countdown}초 남음`}
    >
      <div className="timer-title">타이머</div>

      {/* 진행각: 남은 비율 × 360 */}
      <div
        className="timer-ring"
        style={{ "--angle": `${(countdown / restDuration) * 360}deg` }}
      >
        <div className="timer-inner">
          <div className="timer-digits" aria-live="polite">
            {String(countdown).padStart(2, "0")}
          </div>
        </div>
      </div>

      <button
        className="timer-close"
        onClick={() => {
          setShowTimerModal(false);
          setCountdown(restDuration); // 초기화
        }}
      >
        닫기
      </button>
    </div>
  </div>
)}


        {showConfirmModal && (
          <div className="routine-timer-modal">
            <div className="routine-timer-modal-content">
              <h5>운동 종료</h5>
              <p>체크 표시한 운동만 기록됩니다.</p>
              <p>정말 종료하시겠습니까?</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "1.5rem",
                }}
              >
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
