// 로그인, 로그아웃 커스텀 훅

import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { loginAction, logoutAction } from "../../redux/authSlice";

export function useAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginCustom = (token, userInfo) => {
        const payload = { ...userInfo, token };

        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        dispatch(loginAction(payload));
        
        navigate("/home");
    };

    const logoutCustom = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        dispatch(logoutAction());
        navigate("/login");
    };

    return { loginCustom, logoutCustom };
}