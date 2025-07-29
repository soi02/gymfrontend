import { useEffect, useState } from "react"
import useRoutineService from "../service/routineService";



function WorkoutElement({workoutList}) {
    return (
        <div className="row">
            {/* <div className="col">{workoutList.elementId}</div> */}
            {/* <div className="col">{workoutList.categoryId}</div> */}
            <div className="col">{workoutList.categoryName}</div>
            <div className="col">{workoutList.elementName}</div>
        </div>
    )
}



export default function RoutineFreePage() {

    const [workoutList, setWorkoutList] = useState([]);

    const routineService = useRoutineService();

    useEffect(() => {
        console.log("자유기록 페이지가 마운트 되었습니다.");

        const getWorkouts = async () => {
            try {
                const json = await routineService.getWorkoutList();

                setWorkoutList(json);
                console.table(json);
            } catch(error) {
                console.error(error);
            }
        }

        getWorkouts();
    }, []);

    const routineListElement = workoutList.map(workoutList => (
        <WorkoutElement key={workoutList.elementId} workoutList={workoutList} />
    ));





    return(
        <>
        
        <div className="main-content" style={{height: '100vh', display: 'flex', flexDirection: 'column', marginBottom: '70px'}}>
            <h2>자유운동</h2>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem'}}>
                {routineListElement}    
            </div>
        </div>

        </>
    )
}