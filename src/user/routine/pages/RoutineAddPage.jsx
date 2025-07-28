import { useEffect, useState } from "react"
import useRoutineService from "../service/routineService";

function WorkoutElement({workoutList}) {
    return (
        <div className="row">
            <div className="col">{workoutList.elementId}</div>
            <div className="col">{workoutList.categoryId}</div>
            <div className="col">{workoutList.elementName}</div>
        </div>
    )
}

export default function RoutineAddPage() {

    const [workoutList, setWorkoutList] = useState([]);

    const routineService = useRoutineService();


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


    const routineListElement = workoutList.map(workoutList => (
        <WorkoutElement key={workoutList.elementId} workoutList={workoutList} />
    ));
    


    return(
        <>
        
        루틴 추가 페이지
                    {routineListElement}


        </>
    )
}