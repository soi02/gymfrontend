import axios from "axios"

export default function useRoutineService() {
    const getWorkoutList = async() => {
        const response = await axios.get("http://localhost:8080/api/routine/getArticleList");
        return response.data;
    }

    return {getWorkoutList};
}
