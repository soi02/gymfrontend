import axios from "axios";
import { store } from "../../redux/store";
import { logoutAction } from "../../redux/authSlice";

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        if(error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            store.dispatch(logoutAction()); 
            alert("세션이 만료되어 로그아웃되었습니다.");
        }
        return Promise.reject(error);
    }
);

export default apiClient;