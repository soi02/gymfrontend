// 순수 js 문법 사용
// 리액트 관련 함수 사용 안됨... 훅이 아닌 함수...
// service = 데이터 처리
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 아래는 훅임!
export default function useUserService() {

    const navigate = useNavigate();

    // userInfo를 파라미터로 받아서 유저를 등록함 - RegisterPage.jsx의 const json = await registerUser(formData); 이부분.
    // formData는 id, pw, 닉네임 등등 유저가 작성한 것.

    const registerUser = async (userInfo) => {
        const response = await axios.post('http://localhost:8080/api/user/register', userInfo);

        return response.data;
    };

    // credentials를 파라미터로 받아서 로그인 함.
    const login = async (credentials) => { 
        const response = await axios.post('http://localhost:8080/api/user/login', credentials);
            // 여러 처리 이후
        return response.data;
    }

    return { registerUser, login };
}



