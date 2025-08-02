// 로그인, 로그아웃 커스텀 훅

import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { loginAction, logoutAction } from "../../redux/authSlice";

export function useAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginCustom = (token, userInfo) => {
        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        dispatch(loginAction(userInfo));
        navigate("/");
    };

    const logoutCustom = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        dispatch(logoutAction()); 
        navigate("/gymmadang/login");
    };

    return { loginCustom, logoutCustom };
}