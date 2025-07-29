import axios from "axios"

export default function useRoutineService() {
    const getWorkoutList = async() => {
        const response = await axios.get("http://localhost:8080/api/routine/getArticleList");
        return response.data;
    }

    const getWorkoutGuide = async(id) => {
        const response = await axios.get(`http://localhost:8080/api/routine/getWorkoutGuide/${id}`);
        return response.data;
    }

    return {getWorkoutList, getWorkoutGuide};
}
