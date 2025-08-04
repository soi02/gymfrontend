import axios from "axios"
import { useSelector } from "react-redux";

export default function useRoutineService() {

    const BASE_URL = "http://localhost:8080/api/routine";

    const userId = useSelector(state => state.auth.id);

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

      const getRoutineDetail = async (routineId) => {
        const response = await axios.get(`${BASE_URL}/list/${routineId}`);
        return response.data;
    };

    const getFullRoutineDetail = async (routineId) => {
        const response = await axios.get(`${BASE_URL}/routineSets/${routineId}`);
        return response.data;
    };

    const saveActualWorkout = async (data) => {
        return await axios.post(`${BASE_URL}/saveActualWorkout`, data);
    };

    const getActualWorkout = async(workoutId) => {
        return await axios.get(`${BASE_URL}/result/${workoutId}`);
    }

    const getWorkoutByDate = async (id, selectedDate) => {
    return await axios.get(`${BASE_URL}/getWorkoutByDate`, {
        params: {
        userId: userId,
        date: selectedDate
        }
    });
    };

    const getWorkoutDatesBetween = (userId, startDate, endDate) => {
        return axios.get(`${BASE_URL}/getWorkoutDatesBetween`,{
            params: { userId, startDate, endDate },
        });
    }



    return {getWorkoutList, getWorkoutGuide, saveRoutine, getRoutinesByUserId, getRoutineDetail, getFullRoutineDetail, saveActualWorkout, getActualWorkout, getWorkoutByDate, getWorkoutDatesBetween};
}
