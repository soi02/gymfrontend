import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useRoutineService from "../service/routineService";
import { useSwipeable } from "react-swipeable";
import "../styles/StartWorkoutPage.css";

export default function StartWorkoutPage() {
  const { routineId } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);

  const { getFullRoutineDetail } = useRoutineService();
  const [exerciseList, setExerciseList] = useState([]);
  const [routineSets, setRoutineSets] = useState([]);
  const [currentSets, setCurrentSets] = useState([]);
  const currentExercise = exerciseList[currentIndex];

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
                            <input
                              type="number"
                              value={set.kg}
                              onChange={(e) => {
                                const newSets = [...currentSets];
                                newSets[i] = { ...newSets[i], kg: parseFloat(e.target.value) || 0 };
                                setCurrentSets(newSets);
                              }}
                            />
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) => {
                                const newSets = [...currentSets];
                                newSets[i] = { ...newSets[i], reps: parseInt(e.target.value) || 0 };
                                setCurrentSets(newSets);
                              }}
                            />
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
                  <button>
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
