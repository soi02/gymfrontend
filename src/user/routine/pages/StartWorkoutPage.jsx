import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useRoutineService from "../service/routineService";
import { useSwipeable } from "react-swipeable";

export default function StartWorkoutPage() {
  const { routineId } = useParams();
  const { getRoutineDetail } = useRoutineService();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exerciseList, setExerciseList] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getRoutineDetail(routineId);
      setExerciseList(res.details || []);
    };
    fetch();
  }, [routineId]);

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentIndex((prev) => Math.min(prev + 1, exerciseList.length - 1)),
    onSwipedRight: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true, // 마우스로도 테스트 가능
  });

  const currentExercise = exerciseList[currentIndex];

  return (
    
    <div {...handlers} style={{ padding: "1rem" }}>
          <div className="top-bar">
            {/* ⬇ 요게 progress bar */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0.8rem 0' }}>
{exerciseList.map((_, idx) => (
  <div
    key={idx}
    onClick={() => setCurrentIndex(idx)}
    style={{
      width: currentIndex === idx ? 24 : 10,         // ✅ 길이 조절
      height: 8,
      borderRadius: 8,
      margin: '0 4px',
      backgroundColor: currentIndex === idx ? '#f33' : '#888',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
  />
))}

            </div>

        </div>
      {currentExercise && (
        <>
          <div>
            <h2>{currentExercise.elementName}</h2>
            <img
              src={`http://localhost:8080/uploadFiles/${currentExercise.elementPicture}`}
              alt="운동 이미지"
              style={{ width: "50%" }}
            />
            <p>{currentExercise.categoryName}</p>
          </div>

          <div className="set-table">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="set-row">
                <span>{i + 1}세트</span>
                <input type="number" placeholder="KG" />
                <input type="number" placeholder="횟수" />
                <input type="checkbox" />
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => i - 1)}>⬅ 이전</button>
        <button disabled={currentIndex === exerciseList.length - 1} onClick={() => setCurrentIndex((i) => i + 1)}>다음 ➡</button>
      </div>
    </div>
  );
}
