import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRoutineService from "../service/routineService";
import { useSelector } from "react-redux";
import "../styles/MyRoutinePage.css";
import gold from "../../../assets/img/challenge/norigae/gold.png";
import silver from "../../../assets/img/challenge/norigae/silver.png";
import bronze from "../../../assets/img/challenge/norigae/bronze.png";
import RT00 from "../../../assets/img/routine/RT00.png";
import RT11 from "../../../assets/img/routine/RT11.png";
// import RT22 from "../../../assets/img/routine/RT22.png";
import RT33 from "../../../assets/img/routine/RT33.png";
import RT44 from "../../../assets/img/routine/RT44.png";
import RT55 from "../../../assets/img/routine/RT55.png";
import RT66 from "../../../assets/img/routine/RT66.png";
// import RT77 from "../../../assets/img/routine/RT77.png";
import RT88 from "../../../assets/img/routine/RT88.png";
import RT99 from "../../../assets/img/routine/RT99.png";
import RT1010 from "../../../assets/img/routine/RT1010.png";
import RT1212 from "../../../assets/img/routine/RT1212.png";


export default function MyRoutinePage() {
  const navigate = useNavigate();
  const { getRoutinesByUserId, deleteRoutineById } = useRoutineService();

  const userId = useSelector((state) => state.auth.id);

  const [routines, setRoutines] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null); // 케밥 메뉴 열려있는 루틴 ID
  const menuRef = useRef(null);

  const coverImages = [RT11, RT33, RT44, RT1010, RT88, RT00, RT99, RT66, RT55, RT1212];

  // 루틴 로드
  useEffect(() => {
    const fetchData = async () => {
      const data = await getRoutinesByUserId(userId);
      const unique = data.filter(
        (r, i, self) => i === self.findIndex((x) => x.routineId === r.routineId)
      );
      setRoutines(unique);
    };
    fetchData();
  }, [getRoutinesByUserId, userId]);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpenMenuId(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);




  // 메뉴 액션
  const startThisRoutine = (routineId) => {
    navigate(`/routine/start/${routineId}`);
  };
  const editRoutine = (routineId) => {
    navigate(`/routine/edit/${routineId}`);
  };
  const removeRoutine = async (routineId) => {
    if (!window.confirm("정말 이 루틴을 삭제하시겠소?")) return;
    try {
      await deleteRoutineById(routineId);
      setRoutines((prev) => prev.filter((r) => r.routineId !== routineId));
    } catch (e) {
      alert("삭제 중 문제가 발생했소.");
      console.error(e);
    }
  };

  return (
    <>
    
    <div className="divider-line"></div>
    <div className="mrp-page">

      {/* 헤더/설명 */}
      <div className="mrp-header">
        <h3 className="mrp-title">나의 루틴</h3>
        <p className="mrp-sub">
          나의 루틴에서 <b>오늘 할 운동</b>을 선택해 보시오.<br></br>
        </p>
      </div>

      {/* 리스트 */}
      <div className="mrp-scroll">
        {routines.length === 0 ? (
          <div className="mrp-empty">
            아직 루틴이 없소. 아래 버튼으로 루틴을 만들어보시오.
          </div>
        ) : (
          <ul className="mrp-list">
            {routines.map((r, idx) => {
              const cover = coverImages[idx % coverImages.length];
              const count =
                typeof r.exerciseCount === "number"
                  ? r.exerciseCount
                  : Array.isArray(r.exercises)
                  ? r.exercises.length
                  : null;

              return (
                <li key={r.routineId} className="mrp-item cardish"
                    onClick={() => navigate(`/routine/list/${r.routineId}`)}>
                  
                  {/* 배경/그라데이션 */}
                  <div className={`mrp-bg tint-${idx % 6}`} />

                  {/* 텍스트 영역 */}
                  <div className="mrp-card-content">
                  <div className="mrp-tag">{`루틴 ${idx + 1}`}</div>
                    <h4 className="mrp-card-title">{r.routineName}</h4>

                    <div className="mrp-chips">
                      {count !== null && (
                        <span className="chip">📝 {count} Exercises</span>
                      )}
                      {/* 필요하면 더 추가: 시간/칼로리 등 */}
                      {/* <span className="chip">⏱ 25 min</span>
                          <span className="chip">🔥 440 kcal</span> */}
                    </div>
                  </div>

                  {/* 우측 커버 이미지 */}
                  <img className="mrp-cover" src={cover} alt="" loading="lazy" />

                  {/* 케밥 버튼 (카드 클릭과 겹치지 않게 stopPropagation) */}
                  <button
                    className="mrp-kebab"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId((prev) =>
                        prev === r.routineId ? null : r.routineId
                      );
                    }}
                    aria-label="루틴 메뉴 열기"
                  >
                    ⋯
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {openMenuId === r.routineId && (
                    <div
                      className="mrp-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="mrp-menu-item"
                        onClick={() => navigate(`/routine/list/${r.routineId}`)}                      >
                        이 루틴으로 운동하기
                      </button>

                      <button
                        className="mrp-menu-item danger"
                        onClick={() => removeRoutine(r.routineId)}
                      >
                        삭제하기
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 하단 고정: 루틴 추가 */}
      <div className="mrp-add-fixed">
        <button
          className="mrp-add-btn"
          onClick={() => navigate("/routine/add")}
        >
          + 루틴 추가
        </button>
      </div>
    </div>
</>
  );
}
