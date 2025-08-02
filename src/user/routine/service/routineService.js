import axios from "axios"

export default function useRoutineService() {

    const BASE_URL = "http://localhost:8080/api/routine";


    const getWorkoutList = async() => {
        const response = await axios.get(`${BASE_URL}/getArticleList`);
        return response.data;
    }

    const getWorkoutGuide = async(id) => {
        const response = await axios.get(`${BASE_URL}/getWorkoutGuide/${id}`);
        return response.data;
    }

    const saveRoutine = async(payload) => {
        const response = await axios.post(
            `${BASE_URL}/saveRoutine`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        
        );
        return response.data;
    }

    const getRoutinesByUserId = async(userId)  => {
        const response = await axios.get(`${BASE_URL}/getRoutinesByUserId/${userId}`);
        return response.data;
    }


    return {getWorkoutList, getWorkoutGuide, saveRoutine, getRoutinesByUserId};
}
