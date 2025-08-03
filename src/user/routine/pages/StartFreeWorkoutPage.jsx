import { useLocation } from "react-router-dom"


export default function StartFreeWorkoutPage() {


    const location = useLocation();
    const selectedIds = location.state?.selectedIds || [];


    return(
        <>
        
        자유운동

        </>
    )
}