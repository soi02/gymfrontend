import axios from "axios"

export default function useUserService(){

    const registerUser = async (userInfo) => {
        const response = await axios.post('http://localhost:8080/api/user/register', userInfo);

        return response.data;
    };


    const login = async(credentials)=>{
        const response = await axios.post('http://localhost:8080/api/user/login',credentials);
        return response.data;
    }

    return {registerUser, login}
}