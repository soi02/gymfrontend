import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useRoutineService from '../service/routineService';
import '../styles/MyRoutineListPage.css';

export default function MyRoutineListPage() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { getRoutineDetail } = useRoutineService();

  const [routineName, setRoutineName] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [setsByDetail, setSetsByDetail] = useState({}); // detailId -> sets[]
  const [openIds, setOpenIds] = useState(new Set());   // 열려있는 detailId 모음

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRoutineDetail(routineId);
        setRoutineName(res.routineName ?? '');
        setExerciseList(res.details ?? []);

        const rawSets = res.setList ?? res.sets ?? []; // 백엔드 어디에 담아주든 커버
        const grouped = rawSets.reduce((acc, s) => {
          const dId = Number(s.detailId);
          (acc[dId] ??= []).push(s);
          return acc;
        }, {});
        // set 순서 정렬(있으면 setOrder, 없으면 setId)
        Object.values(grouped).forEach(arr =>
          arr.sort((a, b) => (a.setOrder ?? a.setId ?? 0) - (b.setOrder ?? b.setId ?? 0))
        );
        setSetsByDetail(grouped);
      } catch (err) {
        console.error('❌ 오류 발생:', err);
      }
    };
    fetchData();
  }, [routineId, getRoutineDetail]);

  const toggleOpen = (detailId) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(detailId)) next.delete(detailId);
      else next.add(detailId);
      return next;
    });
  };

  const v = (x, unit = '') => (x === null || x === undefined || x === '' ? `-${unit}` : `${x}${unit}`);

  return (
    <div className="main-content">
      <div className="routine-detail-page">
        {/* 상단 헤더 */}
        <div className="routine-detail-header">
          <button className="routine-back-btn" onClick={() => navigate(-1)}>&lt;</button>
          <h3 className="routine-header-title">{routineName}</h3>
        </div>

        {/* 운동 리스트 */}
        <div className="routine-detail-list">
          {exerciseList.map((ex) => {
            const detailId = Number(ex.detailId);
            const opened = openIds.has(detailId);
            const sets = setsByDetail[detailId] ?? [];

            return (
              <div key={detailId} className="routine-exercise-block">
                {/* 헤더 행 (클릭해서 열고 닫기) */}
                <button
                  type="button"
                  className="routine-exercise-row"
                  onClick={() => toggleOpen(detailId)}
                  aria-expanded={opened}
                >
                  <img
                    src={`http://localhost:8080/uploadFiles/${ex.elementPicture}`}
                    alt={ex.elementName}
                    className="routine-exercise-img"
                  />
                  <div className="routine-exercise-info">
                    <div className="exercise-category">{ex.categoryName}</div>
                    <div className="exercise-name">{ex.elementName}</div>
                  </div>

                  {/* 화살표 */}
                  <span className={`chevron ${opened ? 'open' : ''}`} aria-hidden>&gt;</span>
                </button>

                {/* 펼쳐진 내용: 세트 테이블 */}
                {opened && (
                  <div className="exercise-sets">
                    {sets.length > 0 ? (
                      <table className="set-table">
                        <thead>
                          <tr>
                            <th>세트</th>
                            <th>무게</th>
                            <th>횟수</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sets.map((s, i) => (
                            <tr key={s.setId ?? i}>
                              <td>{i + 1}</td>
                              <td>{v(s.kg, 'kg')}</td>
                              <td>{v(s.reps, '회')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="set-empty">세트 정보가 없습니다.</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div>
          <button
            className="do-this-routine-btn"
            onClick={() => navigate(`/routine/startWorkout/${routineId}`)}
          >
            이 루틴으로 운동하기
          </button>
        </div>
      </div>
    </div>
  );
}
