import { useParams } from "react-router-dom"


export default function StartWorkoutPage() {

    const {routineId} = useParams();



    return(
        <>
        
        <div>
            루틴번호: {routineId}
        </div>

        </>
    )
}