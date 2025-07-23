import axios from "axios"

export default function useUserService(credentials){

    const login = async(credentials)=>{
        const response = await axios.post('http://localhost:8080/api/user/login',credentials);
        return response.data;
    }

    return {login}
}