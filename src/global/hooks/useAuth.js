// 로그인, 로그아웃 커스텀 훅

import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { loginAction, logoutAction } from "../../redux/authSlice";

// useAuth.js
export function useAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginCustom = (token, userInfo) => {
        const payload = { ...userInfo, token };
        localStorage.setItem("token", token);
        dispatch(loginAction(payload));
        navigate("/home");
    };

    const logoutCustom = () => {
        localStorage.removeItem("token");
        dispatch(logoutAction());
        navigate("/login");
    };

    return { loginCustom, logoutCustom };
}