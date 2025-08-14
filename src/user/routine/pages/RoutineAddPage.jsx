import { useEffect, useState } from "react";
import useRoutineService from "../service/routineService";
import "../styles/RoutineAddPage.css";          // 기존 파일
import "../styles/RoutineFreePage.css";         // ← 자유운동과 동일 스타일 재사용
import { useNavigate } from "react-router-dom";

// 자식 컴포넌트 (동일)
function WorkoutElement({ workoutList, onCheck, checked }) {
  const navigate = useNavigate();
  const goToDetail = () => {
    navigate(`/routine/guide/${workoutList.elementId}`);
  };

  return (
    <div className="row align-items-center my-1">
      <div className="col-3" style={{ paddingLeft: "1.4rem", marginRight: "1.5rem" }}>
        <img
          onClick={goToDetail}
          src={`http://localhost:8080/uploadFiles/${workoutList.elementPicture}`}
          alt={workoutList.elementName}
          style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
        />
      </div>

      <div className="col-6">
        <span onClick={goToDetail}>{workoutList.elementName}</span>
      </div>

      <div className="col-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onCheck(workoutList.elementId)}
          style={{
            width: "17px",
            height: "17px",
            transform: "scale(1.4)",
            cursor: "pointer",
            accentColor: "#000000",
          }}
        />
      </div>
    </div>
  );
}

export default function RoutineAddPage() {
  const [workoutList, setWorkoutList] = useState([]);
  const routineService = useRoutineService();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const categories = ["전체", "가슴", "등", "어깨", "팔", "하체"];

  const [selectedItems, setSelectedItems] = useState(new Set());
  const navigate = useNavigate();

  const handleChange = (id) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredList = workoutList.filter((item) => {
    const matchSearch = item.elementName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "전체" || item.categoryName === selectedCategory;
    return matchSearch && matchCategory;
  });

  useEffect(() => {
    const getWorkouts = async () => {
      try {
        const json = await routineService.getWorkoutList();
        setWorkoutList(json);
        console.table(json);
      } catch (e) {
        console.error(e);
      }
    };
    getWorkouts();
  }, []);

  const routineListElement = filteredList.map((item) => (
    <WorkoutElement
      key={item.elementId}
      workoutList={item}
      onCheck={handleChange}
      checked={selectedItems.has(item.elementId)}
    />
  ));

  return (
    <>
      <div className="rfp-page">{/* ← 자유운동과 동일 wrapper */}
        <div className="divider-line" />{/* ← 동일한 상단 라인 */}

        <div className="row">
          <div className="description">{/* ← 동일한 타이틀/설명 블록 */}
            <h4>루틴생성</h4>
            <p>
              루틴으로 저장하고 싶은 운동들을 선택해 보시오.
              <br />
              사진을 누르면 운동 방법을 확인할 수 있소.
            </p>
          </div>
        </div>

        <div className="rfp-scroll">{/* ← 스크롤 영역 컨테이너도 동일 */}
          <input
            type="text"
            className="form-control"
            placeholder="찾는 운동을 적어보시오"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div
            className="routine-hide-scrollbar"
            style={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              marginTop: "0.5rem",
              paddingBottom: "0.5rem",
              maxWidth: "100%",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm me-1 ${
                  selectedCategory === cat ? "btn-secondary" : "btn-outline-secondary"
                }`}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  display: "inline-block",
                  width: "60px",
                  fontSize: "0.85rem",
                  padding: "0.3rem 0.8rem",
                  marginTop: "0.3rem",
                  borderRadius: "999px",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {routineListElement}

          {/* 하단 고정 버튼 컨테이너/버튼 클래스도 자유운동과 동일 */}
          <div className="routine-my-routine-add-container">
            <button
              className={`routine-my-routine-add-btn ${selectedItems.size === 0 ? "disabled" : ""}`}
              disabled={selectedItems.size === 0}
              onClick={() => {
                if (selectedItems.size > 0) {
                  const selectedWorkouts = workoutList.filter((i) => selectedItems.has(i.elementId));
                  navigate("/routine/addDetail", { state: { selectedWorkouts } });
                }
              }}
            >
              {selectedItems.size === 0
                ? "루틴에 포함할 운동을 선택해주시오"
                : `${selectedItems.size}개의 운동으로 새로운 루틴을 만들겠소`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
