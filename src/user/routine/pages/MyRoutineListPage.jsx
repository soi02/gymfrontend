import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useRoutineService from '../service/routineService'; // ← 이거 루틴 상세 가져오는 메서드 있어야 해!
import '../styles/MyRoutineListPage.css'; // 스타일 따로

export default function MyRoutineListPage() {
  const { routineId } = useParams();
    console.log("routineId:", routineId); // 여기에 null이나 undefined면 문제 생김!

  const navigate = useNavigate();
  const { getRoutineDetail } = useRoutineService(); // ← 이건 서비스에서 만들었지?

  const [routineName, setRoutineName] = useState('');
  const [exerciseList, setExerciseList] = useState([]);


    useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await getRoutineDetail(routineId);
            console.log("✅ 받아온 데이터:", res);
            setRoutineName(res.routineName);
            setExerciseList(res.details ?? []);
            console.table("🔥 setList 내용:", res.setList);

        } catch (err) {
            console.error("❌ 오류 발생:", err);
        }
    };

    fetchData();
    }, [routineId]);



  return (
    <div className="routine-detail-page">
      {/* 상단 헤더 */}
      <div className="routine-detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h3>{routineName}</h3>
      </div>

      {/* 운동 리스트 */}
      <div className="routine-detail-list">
        {exerciseList.map((exercise, idx) => (
          <div key={idx} className="exercise-card">
            <img src={`http://localhost:8080/uploadFiles/${exercise.elementPicture}`} alt={exercise.name} className="exercise-img" />
            <div className="exercise-info">

              <div className="exercise-name">{exercise.categoryName}</div>
              <div className="exercise-name">{exercise.elementName}</div>
              {/* <div className="exercise-name">{exercise.elementName}</div> */}

            </div>
          </div>
        ))}
      </div>

      <div>
        <button>수정하기</button>
        <button onClick={() => navigate(`/gymmadang/routine/startWorkout/${routineId}`)}>이 루틴으로 운동하기</button>
      </div>
    </div>
  );
}
