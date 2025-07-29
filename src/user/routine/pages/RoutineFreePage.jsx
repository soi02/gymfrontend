import { use, useEffect, useState } from "react"
import useRoutineService from "../service/routineService";
import "../styles/RoutineFreePage.css"



function WorkoutElement({workoutList, onCheck, checked}) {
    return (
        <div className="row align-items-center my-1">
            <div className="col">{workoutList.categoryName}</div>
            {/* <div className="col">{workoutList.elementPicture}</div> */}
            <div className="col">{workoutList.elementName}</div>
            <div className="col-1">
                <input 
                    type="checkbox"
                    checked={checked}
                    onChange={() => onCheck(workoutList.elementId)}
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
    





    return(
        <>
        
        <div className="main-content" style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
            <h2>자유운동</h2>
                
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem'}}>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="찾으시는 운동을 검색해보세요."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                <div
                className="hide-scrollbar"
                style={{
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    marginTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    marginBottom: '1rem',
                    maxWidth: '100%'
                }}
                >
                    {categories.map(cat => (

                        <button
                        key={cat}
                        className={`btn btn-sm me-1 ${selectedCategory === cat ? "btn-dark" : "btn-outline-secondary"}`}
                        onClick={() => setSelectedCategory(cat)}
                        
                        style={{
                            display: 'inline-block',
                            width: '60px',
                            fontSize: '0.85rem',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '999px',
                        }}
                        >
                            
                        {cat}
                        
                        </button>
                    ))}
                </div>

                <p>선택된 운동: {selectedItems.size}개</p>

                {routineListElement}    

                <div className="routine-my-routine-add-container">
                  <button className="routine-my-routine-add-btn">운동 시작하기</button>
                </div>
            </div>
        </div>

        </>
    )
}