// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// localStorage에서 초기 상태를 가져오는 로직을 initialState에 직접 추가합니다.
const token = localStorage.getItem("token");
const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : {};

const initialState = {
    // 토큰이 있으면 로그인 상태, 없으면 로그아웃 상태
    isAuthenticated: !!token, 
    name: userInfo.name || '',
    id: userInfo.id || null,
    token: token || null
}

// authSlice : 슬라이스명
// createSlice : redux api
export const authSlice = createSlice({
    name: 'auth', 
    initialState,
    reducers : {
        loginAction: (state, action) => {
            state.isAuthenticated = true;
            state.name = action.payload.name; 
            state.id = action.payload.id;
            state.token = action.payload.token;
        }, 

        logoutAction: (state) => {
            state.isAuthenticated = false;
            state.name = '';
            state.id = null;
            state.token = null;
        }
    }
});

export const {loginAction, logoutAction} = authSlice.actions;
export default authSlice.reducer;