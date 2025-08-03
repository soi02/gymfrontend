import { use, useEffect, useState } from "react"
import useRoutineService from "../service/routineService";
import "../styles/RoutineFreePage.css"
import { useNavigate } from "react-router-dom";



function WorkoutElement({workoutList, onCheck, checked}) {
    const navigate = useNavigate();

    const goToDetail = () => {
        navigate(`/gymmadang/routine/guide/${workoutList.elementId}`);
    };


    return (
        <div className="row align-items-center my-1">
            {/* <div className="col-2">{workoutList.categoryName}</div> */}
            {/* <div className="col">{workoutList.elementPicture}</div> */}
            {/* <div className="col-1 d-flex align-items-center">
                <span
                    onClick={goToDetail}
                    title="운동 정보 보기"
                    style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        color: "#555"
                    }}
                
                >
                    ⓘ
                </span>
            </div> */}
            <div className="col-3" style={{paddingLeft: '1.4rem', marginRight: '1.5rem'}}>
                <img
                    onClick={goToDetail}
                    src={`http://localhost:8080/uploadFiles/${workoutList.elementPicture}`} // or 이미지 서버 주소
                    alt={workoutList.elementName}
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                />
            </div>

            <div className="col-6">
                <span
                    onClick={goToDetail}
                >
                    {workoutList.elementName}
                </span>

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
                    accentColor: "#000000"
            }}
            />

            </div>
        </div>
    )
}



export default function RoutineFreePage() {

    const [workoutList, setWorkoutList] = useState([]);

    const routineService = useRoutineService();

    // 검색어 상태
    const [searchTerm, setSearchTerm] = useState("");
    // 카테고리 필터 상태
    const [selectedCategory, setSelectedCategory] = useState("전체");

    const categories =  ["전체", "가슴", "등", "어깨", "팔", "하체"];

    const [selectedItems, setSelectedItems] = useState(new Set());


    // 여기는 부모 컴포넌트(RoutineAddPage) 안에 정의된 함수
    // 체크박스를 눌렀을 때 id가 선택된 항목이면 체크해제, id가 없으면 추가.
    const handleChange = (id) => {
        // prev는 이전 상태(Set)값
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id); // ❌ 체크 해제
            } else {
                newSet.add(id); // ✅ 체크 추가
            }
            return newSet;
        })
    }



    // 필터링 로직
    const filteredList = workoutList.filter(item => {
    const matchSearch = item.elementName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "전체" || item.categoryName === selectedCategory;
    return matchSearch && matchCategory;
    });


    

    useEffect(() => {
        console.log("RoutineAddPage 컴포넌트가 마운트 되었습니다.");

        const getWorkouts = async () => {
            try {
                const json = await routineService.getWorkoutList();
                setWorkoutList(json);
                console.table(json);
            } catch (error) {
                console.error(error);
            }
        }

        getWorkouts();
    }, []);


    // filteredList는 검색어 + 카테고리 필터에 따라 걸러진 운동들. .map()은 배열을 하나씩 순회하면서 컴포넌트로 변환.
    const routineListElement = filteredList.map(item => (
        // 운동항목 하나하나를 보여주는 컴포넌트 - 반복생성
    <WorkoutElement
        // 각 컴포넌트를 구분하기 위한 고유 값. 리스트 랜더링할 때 필수로 넣음.
        key={item.elementId}
        workoutList={item} // 운동데이터
        onCheck={handleChange} // 체크 이벤트 함수
        checked={selectedItems.has(item.elementId)} // 체크 여부
    />
    ));
    
    const navigate = useNavigate();

    const handleStartFreeWorkout = () => {
        if(selectedItems.size === 0) {
            alert("운동을 한 개 이상 선택하시오.");
            return;
        }

        navigate("/gymmadang/routine/startFreeWorkout", {
            state: {
                selectedIds: [...selectedItems]
            }
        });
    };



    return (
        <>
            <div
                className="main-content"
                style={{ height: "100vh", display: "flex", flexDirection: "column" }}
            >
                <div className="row">
                    <div className="col" style={{ paddingTop: "1rem", paddingLeft: "2rem" }}>
                        <h3>자유운동</h3>
                        <p>
                            오늘 하고싶은 운동을 자유롭게 선택해 보시오.
                            <br />
                            사진을 누르면 운동 방법을 확인할 수 있소.
                        </p>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "1rem"}}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="찾는 운동을 적어보시오"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div
                        className="hide-scrollbar"
                        style={{
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            marginTop: "0.5rem",
                            paddingBottom: "0.5rem",
                            marginBottom: "1rem",
                            maxWidth: "100%",
                        }}
                    >
                        
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`btn btn-sm me-1 ${
                                    selectedCategory === cat
                                        ? "btn-secondary"
                                        : "btn-outline-secondary"
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
                    {/* <p>선택한 운동: {selectedItems.size}개</p> */}

                    {/* <div className="routine-my-routine-add-container">
                        <button className="routine-my-routine-add-btn">{selectedItems.size}개의 운동 바로 시작하겠소</button>
                    </div> */}

                    <div className="routine-my-routine-add-container">
                        <button
                            className={`routine-my-routine-add-btn ${selectedItems.size === 0 ? 'disabled' : ''}`}
                            disabled={selectedItems.size === 0}
                            onClick={handleStartFreeWorkout}
                        >
                            {selectedItems.size === 0
                                ? '오늘의 운동을 선택해주시오'
                                : selectedItems.size + "개의 운동 바로 시작하겠소"
                            }

                        </button>
                    </div>



                </div>
            </div>
        </>
    );

}