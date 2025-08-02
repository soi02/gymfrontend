import axios from "axios";
import { store } from "../../redux/store";
import { logoutAction } from "../../redux/authSlice";

// 공통 axios 인스턴스
// 토큰 자동 추가 코드는 안 들어있음. 따라서 요청 보낼 때 명시적으로 헤더에 토큰 넣어줘야 함!

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// 응답 인터셉터 : 에러처리
apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        if(error.response?.status === 401) {
            // 토큰 인증 만료 시, 로그아웃 처리
            localStorage.removeItem("token");
            store.dispatch(logoutAction()); 
            alert("세션이 만료되어 로그아웃되었습니다.");
        }
        return Promise.reject(error);
    }
);

export default apiClient;