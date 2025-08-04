import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useRoutineService from "../service/routineService";
import { useSwipeable } from "react-swipeable";
import "../styles/StartWorkoutPage.css";

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
          <div className="routine-progress-bar">
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
                src={`http://localhost:8080/uploadFiles/${currentExercise.elementPicture}`}
                alt={currentExercise.elementName}
              />
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
                        const newCurrentSets = currentSets.map((s, idx) =>
                          idx >= i ? { ...s, kg: parsed } : s
                        );
                        setCurrentSets(newCurrentSets);

                        const newRoutineSets = routineSets.map((s) =>
                          s.elementId === currentExercise.elementId && s.setId >= set.setId
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
                        const newCurrentSets = currentSets.map((s, idx) =>
                          idx >= i ? { ...s, reps: parsed } : s
                        );
                        setCurrentSets(newCurrentSets);

                        const newRoutineSets = routineSets.map((s) =>
                          s.elementId === currentExercise.elementId && s.setId >= set.setId
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
                        s => s.elementId === currentExercise.elementId && s.setId === set.setId
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

      </div>
    </div>
  );
}
